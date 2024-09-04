import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { z } from "zod";

const app = express();
const port = 4000;

app.use(express.json());

// MongoDB Atlas connection
mongoose.connect("mongodb+srv://phorsbeatrmx0509:phorsbeatrmx0509@cluster0.ltlfa.mongodb.net/")
	.then(() => console.log("Connected to MongoDB Atlas"))
	.catch((error) => console.error("MongoDB connection error:", error));

// Item model
const itemSchema = new mongoose.Schema({
	name: String,
	price: Number,
	category: String,
	stock: Number
});

const Item = mongoose.model("Item", itemSchema);

// Input validation schema
const itemInputSchema = z.object({
	name: z.string().min(1),
	price: z.number().positive(),
	category: z.string().min(1),
	stock: z.number().int().nonnegative()
});

// Validation middleware
const validateItemInput = (req: Request, res: Response, next: NextFunction) => {
	try {
		itemInputSchema.parse(req.body);
		next();
	} catch (error) {
		if (error instanceof z.ZodError) {
			res.status(400).json({ error: error.errors });
		} else {
			res.status(400).json({ error: "Invalid input" });
		}
	}
};

app.use((_req: Request, _res: Response, next: NextFunction) => {
	console.log(`Request received at ${new Date().toDateString()}`);
	next();
});

app.get("/items", async (_req: Request, res: Response) => {
	try {
		const items = await Item.find();
		res.status(200).json(items);
	} catch (error) {
		res.status(500).send("Error fetching items");
	}
});

app.get("/item/:id", async (req: Request, res: Response) => {
	try {
		const item = await Item.findById(req.params.id);
		if (!item) return res.status(404).send("Item not Found");
		res.json(item);
	} catch (error) {
		res.status(500).send("Error fetching item");
	}
});

app.post("/item", validateItemInput, async (req: Request, res: Response) => {
	try {
		const newItem = new Item(req.body);
		await newItem.save();
		res.status(201).send(newItem);
	} catch (error) {
		res.status(500).send("Error creating item");
	}
});

app.put("/item/:id", validateItemInput, async (req: Request, res: Response) => {
	try {
		const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!updatedItem) {
			return res.status(404).send("Item not found!");
		}
		res.status(200).json(updatedItem);
	} catch (error) {
		res.status(500).send("Error updating item");
	}
});

app.delete("/item/:id", async (req: Request, res: Response) => {
	try {
		const deletedItem = await Item.findByIdAndDelete(req.params.id);
		if (!deletedItem) return res.status(404).send("Item not found!");
		res.status(200).json(`Item with id ${req.params.id} was deleted`);
	} catch (error) {
		res.status(500).send("Error deleting item");
	}
});

app.listen(port, () => {
	console.log(`Server running at: http://localhost:${port}`);
});