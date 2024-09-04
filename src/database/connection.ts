import mongoose from "mongoose";


export const connectionToDatabase = async () => {
    try {
        await mongoose.connect("mongodb+srv://phorsbeatrmx0509:phorsbeatrmx0509@cluster0.ltlfa.mongodb.net/")
        console.log("Connected to the MongoDB Atlas ")
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}
