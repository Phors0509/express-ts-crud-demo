import { Request, Response, NextFunction } from 'express';
import { Items } from '../models/modelItem';
import { AppError } from '../handle-error/error-handle';
import mongoose from 'mongoose';


export const getAllItems = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // Pagination & limit 

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;
        const skip = (page - 1) * limit;

        // Filter by Category

        const category = req.query.category as string;

        const filter: { [key: string]: any } = {};

        // Loop through query parameters to build the filter
        for (const key in req.query) {
            if (key !== 'page' && key !== 'limit' && key !== 'sort' && key !== 'sortOrder') {
                filter[key] = req.query[key];
            }
        }

        // Sort by price and stock

        const sortBy = req.query.sort as string
        const sortOrder = req.query.sortOrder as string === "desc" ? -1 : 1

        // Query find all items 

        let query = Items.find(filter);

        if (category) {
            query.where("category").equals(category)
        }

        if (sortBy && ['price', 'stock', 'name', 'category'].includes(sortBy)) {
            query = query.sort({ [sortBy]: sortOrder });
        }

        // pass query 

        const items = await query.skip(skip).limit(limit);

        const totalPages = await Items.countDocuments(category ? { category } : {})

        res.status(200).json({ items, totalItem: items.length, currentPage: page, totalPages: Math.ceil(totalPages / limit), limit: limit })
    } catch (err) {
        next(err)
    }
}

export const getOneItem = async (req: Request, res: Response, next: NextFunction) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            const error = new Error("Can't found item") as AppError
            error.statusCode = 404
            throw error
        }

        const item = await Items.findById(req.params.id)

        res.status(200).json(item)

    } catch (error) {
        next(error)
    }
}

export const createItem = async (req: Request, res: Response) => {
    try {
        const newItem = new Items(req.body)
        await newItem.save()
        res.status(201).json(newItem)
    } catch (error) {
        res.status(500).send("Error creating Items")

    }
}

export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            const error = new Error("Can't found item") as AppError
            error.statusCode = 404
            throw error
        }

        const updateItem = await Items.findByIdAndUpdate(req.params.id, req.body, { new: true })

        res.status(200).json(updateItem)
    } catch (error) {
        next(error)
    }
}

export const deleteItem = async (req: Request, res: Response) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid item ID format. Must be a 24-character hexadecimal string.' });
        }

        const deleteItem = await Items.findByIdAndDelete(req.params.id)

        if (!deleteItem) {
            const error = new Error("Can't found item") as AppError
            error.statusCode = 404
            throw error
        }

        res.status(200).json(`Item id : ${req.params.id} was deleted`)

    } catch (error) {
        res.status(500).send("Error deleting Items")
    }
}