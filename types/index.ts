import { z } from "zod"
import { ProductInputSchema } from "@/lib/validator"

export type IProductInput = z.infer<typeof ProductInputSchema>

export type Data = {
    products: IProductInput[]
    headerMenus:{
        name: string
        href: string
    }[]
    carousels: {
        image: string
        url: string
        title: string
        buttonCaption: string
        isPublished: boolean
    }[]
}