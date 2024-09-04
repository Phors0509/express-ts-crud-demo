import mongoose from "mongoose";
import config from "../config";


export const connectionToDatabase = async () => {
    try {
        await mongoose.connect(`${config.MONGODB_URL}`)
        console.log("Connected to the MongoDB Atlas ")
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}
