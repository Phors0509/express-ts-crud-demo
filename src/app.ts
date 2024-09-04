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

app.get("/items", async (req: Request, res: Response) => {
    try {

        // Pagination & limit 

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;
        const skip = (page - 1) * limit;

        // Filter by Category

        const category = req.query.category as string;

        // Sort by price and stock

        const sortBy = req.query.sort as string
        const sortOrder = req.query.sortOrder as string === "desc" ? -1 : 1



        // Query find all items 

        let query = Items.find();

        if (category) {
            query.where("category").equals(category)
        }

        if (sortBy && ['price', 'stock'].includes(sortBy)) {
            query = query.sort({ [sortBy]: sortOrder });
        }

        // pass query 

        const items = await query.skip(skip).limit(limit);
        const totalPages = await Items.countDocuments(category ? { category } : {})

        res.status(200).json({ items, currentPage: page, totalPages: Math.ceil(totalPages / limit), limit: limit })
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

// Error handling middleware

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err)
    res.status(500).send("Something went wrong")
})

export default app;