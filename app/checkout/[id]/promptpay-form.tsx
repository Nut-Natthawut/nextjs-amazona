/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ProductPrice from '@/components/shared/product/product-price'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { updateOrderPaymentStatus } from '@/lib/actions/order.actions'
import { QRCodeSVG } from 'qrcode.react'
import { formatDateTime } from '@/lib/utils'

interface PaymentHistory {
  timestamp: Date
  status: 'pending' | 'completed' | 'failed'
  amount: number
}

export default function PromptPayForm({
  orderId,
  totalPrice,
}: {
  orderId: string
  totalPrice: number
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'completed'>('pending')
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([])
  const [checkCount, setCheckCount] = useState(0)

  // This would be your actual PromptPay ID
  const promptPayId = process.env.NEXT_PUBLIC_PROMPTPAY_ID || '0812345678'

  // Generate PromptPay payload
  const generatePromptPayPayload = () => {
    // Format: 00020101021229370016A000000677010111011300668123456785802TH53037646304${amount}6304
    const amount = totalPrice.toFixed(2)
    return `00020101021229370016A00000067701011101130066${promptPayId}5802TH53037646304${amount}6304`
  }

  const handleConfirmPayment = async () => {
    setIsLoading(true)
    try {
      const res = await updateOrderPaymentStatus(orderId)
      if (res.success) {
        setPaymentStatus('completed')
        setPaymentHistory(prev => [...prev, {
          timestamp: new Date(),
          status: 'completed',
          amount: totalPrice
        }])
        toast({
          title: 'สำเร็จ',
          description: 'ยืนยันการชำระเงินสำเร็จ',
          variant: 'default',
        })
        router.push(`/account/orders/${orderId}`)
      } else {
        setPaymentHistory(prev => [...prev, {
          timestamp: new Date(),
          status: 'failed',
          amount: totalPrice
        }])
        toast({
          title: 'เกิดข้อผิดพลาด',
          description: res.message || 'ไม่สามารถยืนยันการชำระเงินได้',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      setPaymentHistory(prev => [...prev, {
        timestamp: new Date(),
        status: 'failed',
        amount: totalPrice
      }])
      
      // จัดการ error message ตามประเภทของ error
      let errorMessage = 'เกิดข้อผิดพลาดในการยืนยันการชำระเงิน'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error?.message) {
        errorMessage = error.message
      }

      toast({
        title: 'เกิดข้อผิดพลาด',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Simulate payment status checking
  useEffect(() => {
    if (paymentStatus === 'checking' && checkCount < 5) {
      const timer = setTimeout(() => {
        setCheckCount(prev => prev + 1)
        // Simulate checking payment status
        if (Math.random() > 0.7) {
          setPaymentStatus('completed')
          setPaymentHistory(prev => [...prev, {
            timestamp: new Date(),
            status: 'completed',
            amount: totalPrice
          }])
          toast({
            title: 'สำเร็จ',
            description: 'ตรวจพบการชำระเงินสำเร็จ',
            variant: 'default',
          })
        }
      }, 5000) // Check every 5 seconds

      return () => clearTimeout(timer)
    } else if (paymentStatus === 'checking' && checkCount >= 5) {
      // ถ้าตรวจสอบครบ 5 ครั้งแล้วยังไม่พบการชำระเงิน
      setPaymentStatus('pending')
      setPaymentHistory(prev => [...prev, {
        timestamp: new Date(),
        status: 'failed',
        amount: totalPrice
      }])
      toast({
        title: 'ไม่พบการชำระเงิน',
        description: 'ไม่พบการชำระเงิน กรุณาลองใหม่อีกครั้ง',
        variant: 'destructive',
      })
    }
  }, [paymentStatus, checkCount, totalPrice, toast])

  const startPaymentCheck = () => {
    setPaymentStatus('checking')
    setCheckCount(0)
    setPaymentHistory(prev => [...prev, {
      timestamp: new Date(),
      status: 'pending',
      amount: totalPrice
    }])
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="text-xl font-bold">ชำระเงินผ่าน PromptPay</div>
        <div className="space-y-4">
          <p>กรุณาสแกน QR Code ด้านล่างเพื่อชำระเงิน:</p>
          <div className="flex justify-center p-4 bg-white rounded-lg">
            <QRCodeSVG
              value={generatePromptPayPayload()}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          <div className="text-center">
            <p className="font-bold">จำนวนเงินที่ต้องชำระ:</p>
            <ProductPrice price={totalPrice} plain />
          </div>
          <div className="text-sm text-gray-600">
            <p>ขั้นตอนการชำระเงิน:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>เปิดแอปพลิเคชันธนาคารในมือถือของคุณ</li>
              <li>สแกน QR Code ด้านบน</li>
              <li>ตรวจสอบจำนวนเงินและผู้รับเงิน</li>
              <li>ทำการชำระเงิน</li>
              <li>กดปุ่มด้านล่างหลังจากชำระเงินเสร็จสิ้น</li>
            </ol>
          </div>

          {paymentStatus === 'pending' && (
            <Button
              className="w-full"
              onClick={startPaymentCheck}
              disabled={isLoading}
            >
              เริ่มตรวจสอบการชำระเงิน
            </Button>
          )}

          {paymentStatus === 'checking' && (
            <div className="text-center">
              <p className="text-blue-600">กำลังตรวจสอบการชำระเงิน...</p>
              <p className="text-sm text-gray-500">กรุณารอสักครู่</p>
            </div>
          )}

          {paymentStatus === 'completed' && (
            <Button
              className="w-full"
              onClick={handleConfirmPayment}
              disabled={isLoading}
            >
              {isLoading ? 'กำลังยืนยัน...' : 'ฉันได้ชำระเงินแล้ว'}
            </Button>
          )}

          {paymentHistory.length > 0 && (
            <div className="mt-4">
              <p className="font-bold mb-2">ประวัติการตรวจสอบ:</p>
              <div className="space-y-2">
                {paymentHistory.map((history, index) => (
                  <div key={index} className="text-sm border-b pb-2">
                    <p>เวลา: {formatDateTime(history.timestamp).dateTime}</p>
                    <p>สถานะ: {
                      history.status === 'pending' ? 'รอตรวจสอบ' :
                      history.status === 'completed' ? 'ชำระเงินสำเร็จ' :
                      'ชำระเงินไม่สำเร็จ'
                    }</p>
                    <p>จำนวนเงิน: <ProductPrice price={history.amount} plain /></p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 