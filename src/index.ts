import express, { NextFunction, Request, Response } from "express";


const app = express();
const port = 4000;

app.use(express.json())

app.use((_req: Request, _res: Response, next: NextFunction) => {
	console.log(`Request received at ${new Date().toDateString()}`);
	next();
})


interface ItemsProp {
	id: number
	name: string
}

const items: ItemsProp[] = [
	{
		id: 1,
		name: "So Phorn"
	},
	{
		id: 2,
		name: "So Pshea"
	}
];

app.get("/items", (_req: Request, res: Response) => {
	if (!items) return res.status(404).send("Item Not Founds !")
	res.status(200).json(items)
})

app.get("/item/:id", (req: Request, res: Response) => {
	const item = items.find(i => i.id === parseInt(req.params.id))
	if (!item) return res.status(404).send("Item not Found Brother")
	res.json(item)
})

app.post("/item", (req: Request, res: Response) => {
	const newItem: ItemsProp = {
		id: items.length === 0 ? 1 : items[items.length - 1].id + 1,
		name: req.body.name
	}
	if (!newItem.name) return res.status(400).send("Check Code !!!")
	items.push(newItem)
	res.status(201).send(newItem)
})

app.put("/item/:id", (req: Request, res: Response) => {
	const updateItem = items.find(i => i.id === parseInt(req.params.id))
	if (!updateItem) {
		return res.status(404).send("Not Found !")
	}
	updateItem.name = req.body.name
	res.status(201).json(updateItem)
})

app.delete("/item/:id", (req: Request, res: Response) => {
	const item = items.findIndex(item => item.id === parseInt(req.params.id))
	if (item === -1) return res.status(404).send("Not Found !")
	items.splice(item, 1)
	res.status(200).json(`Item Id ${req.params.id} was Deleted`)
})

app.listen(port, () => {
	console.log(`Server run at : http://localhost:${port}`)
})
