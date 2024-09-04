import express, { Request, Response, NextFunction } from 'express';
import { Items } from './models/modelItem'
import { validationItemInput } from './validation/validationItemInput'

const app = express();
app.use(express.json())

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

app.put("/items/:id", async (req: Request, res: Response) => {
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

// Error handling middleware

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err)
    res.status(500).send("Something went wrong")
})

export default app;