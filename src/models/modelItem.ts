import mongoose from "mongoose"

//Item Model

const ItemsSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    stock: Number
})

export const Items = mongoose.model("Items", ItemsSchema)
