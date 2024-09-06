import { Request, Response, NextFunction } from "express"
import { Schema, z } from "zod"

// Validation middleware

export const validationItemInput = (schema: Schema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parse(req.body)
            next()
        } catch (err) {
            if (err instanceof z.ZodError) {
                res.status(404).json({ err: err.errors })
            } else {
                res.status(400).json({ err: "Invalid input" })
            }
        }
    }
}