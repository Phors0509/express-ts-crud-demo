import { Request, Response, NextFunction } from "express"
import { z } from "zod"

// Input validation schema
const itemInputSechama = z.object({
    name: z.string().min(1),
    price: z.number().positive(),
    category: z.string().min(1),
    stock: z.number().int().nonnegative()
})

// Validation middleware

export const validationItemInput = (req: Request, res: Response, next: NextFunction) => {
    try {
        itemInputSechama.parse(req.body)
        next()
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ err: err.errors })
        } else {
            res.status(400).json({ err: "Invalid input" })
        }
    }
}