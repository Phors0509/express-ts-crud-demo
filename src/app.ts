import express from 'express';
import { validationItemInput } from './validation/validationItemInput'
import { errorHandler } from './handle-error/error-handle';
import { itemsInputSechama } from './schema/schema';
import {
    createItem,
    deleteItem,
    getAllItems,
    getOneItem,
    updateItem
} from './controller/controllerAPI';
import { requestLog } from './middleWare/requestLog';

const app = express();

app.use(express.json())

app.use(requestLog)

// Get all items

app.get("/items", getAllItems)

// Get Only Item

app.get("/items/:id", getOneItem)

// Post Item 

app.post("/items", validationItemInput(itemsInputSechama), createItem)

// Put Item (Update)

app.put("/items/:id", validationItemInput(itemsInputSechama), updateItem)

// Delete Item  

app.delete("/items/:id", deleteItem)

// Error handling middleware

app.use(errorHandler)

export default app;