export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Amazona";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev'
export const SENDER_NAME = process.env.SENDER_NAME || APP_NAME
export const APP_SLOGAN =
    process.env.NEXT_PUBLIC_APP_SLOGAN || "Spend less, live more.";
export const APP_DESCRIPTION =
    process.env.NEXT_PUBLIC_APP_DESCRIPTION || "An Amazon  built with Next.js, MongoDB, Shadcn";
export const APP_COPYRIGHT =
    process.env.NEXT_PUBLIC_APP_COPYRIGHT ||
    `Copyright © 2025 ${APP_NAME}. All rights reserved.`


export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 9)

export const FREE_SHIPPING_MIN_PRICE = Number(
    process.env.FREE_SHIPPING_MIN_PRICE || 35
  )

  export const AVAILABLE_PAYMENT_METHODS = [
    {
      name: 'PromptPay',
      commission: 0,
      isDefault: true,
    },
    {
      name: 'PayPal',
      commission: 0,
      isDefault: true,
    },
    {
      name: 'Stripe',
      commission: 0,
      isDefault: true,
    },
    {
      name: 'Cash On Delivery',
      commission: 0,
      isDefault: true,
    },
  ]
  export const DEFAULT_PAYMENT_METHOD =
    process.env.DEFAULT_PAYMENT_METHOD || 'PayPal'
  
  export const AVAILABLE_DELIVERY_DATES = [
    {
      name: 'Tomorrow',
      daysToDeliver: 1,
      shippingPrice: 12.9,
      freeShippingMinPrice: 0,
    },
    {
      name: 'Next 3 Days',
      daysToDeliver: 3,
      shippingPrice: 6.9,
      freeShippingMinPrice: 0,
    },
    {
      name: 'Next 5 Days',
      daysToDeliver: 5,
      shippingPrice: 4.9,
      freeShippingMinPrice: 35,
    },
  ]