import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';

const app = express();
const PORT = 4000;
app.use(express.json())

// Connect MongoDB Atlas 

mongoose.connect("mongodb+srv://phorsbeatrmx0509:phorsbeatrmx0509@cluster0.ltlfa.mongodb.net/")
    .then(() => {
        console.log("Connected to the MongoDB Atlas ")
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => console.log("MongoDB connected error :", err))

//Item Model

const ItemsSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    stock: Number
})

const Items = mongoose.model("Items", ItemsSchema)

// Input validation schema
const itemInputSechama = z.object({
    name: z.string().min(1),
    price: z.number().positive(),
    category: z.string().min(1),
    stock: z.number().int().nonnegative()
})

// Validation middleware

const validationItemInput = (req: Request, res: Response, next: NextFunction) => {
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

app.use((_req: Request, _res: Response, next: NextFunction) => {
    console.log(`Request received at ${new Date().toLocaleDateString()}`)
    next();
})

// Get all items

app.get("/items", async (_req: Request, res: Response) => {
    try {
        const items = await Items.find()
        res.status(200).json(items)
    } catch (err) {
        res.status(500).send("Error fetcing Items")
    }
})

// Get Only Item

app.get("/items/:id", async (req: Request, res: Response) => {
    try {
        const item = await Items.findById(req.params.id)
        if (!item) return res.status(404).send("Not found Item")
        res.status(200).json(item)
    } catch (error) {
        res.status(500).send("Error fetcing Items")
    }
})

// Post Item 

app.post("/items", validationItemInput, async (req: Request, res: Response) => {
    try {
        const newItem = new Items(req.body)
        await newItem.save()
        res.status(201).json(newItem)
    } catch (error) {
        res.status(500).send("Error creating Items")

    }
})

// Put Item (Update)

app.put("/items/:id", validationItemInput, async (req: Request, res: Response) => {
    try {
        const updateItem = await Items.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!updateItem) return res.status(404).send("Not found Item")
        res.status(200).json(updateItem)
    } catch (error) {
        res.status(500).send("Error updating Items")

    }
})

// Delete Item 

app.delete("/items/:id", async (req: Request, res: Response) => {
    try {
        const deleteItem = await Items.findByIdAndDelete(req.params.id)
        if (!deleteItem) return res.status(404).send("Not found Item")
        res.status(200).json(`Item id : ${req.params.id} was deleted`)
    } catch (error) {
        res.status(500).send("Error deleting Items")
    }
})

