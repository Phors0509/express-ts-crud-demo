import { z } from "zod"

export const itemsInputSechama = z.object({
    name: z.string().min(1),
    price: z.number().positive(),
    category: z.string().min(1),
    stock: z.number().int().nonnegative()
})