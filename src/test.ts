import express, { Request, Response } from 'express';

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

let items: string[] = []; // Array to store items

// GET endpoint to retrieve all items
app.get("/items", (_req: Request, res: Response) => {
    if (items.length === 0) {
        return res.status(404).send("No items found!");
    }
    res.status(200).json(items);
});

// POST endpoint to create a new item
app.post("/items", (req: Request, res: Response) => {
    const newItem = req.body.item;
    if (!newItem) {
        return res.status(400).send("Item is required!");
    }
    items.push(newItem);
    res.status(201).json({ message: "Item created successfully", item: newItem });
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});