import express from 'express';
import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDB = async () => {
    try {
        // Debug: Check if URI exists
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        // Debug: Log the URI (remove this in production)
        console.log("Connecting to:", process.env.MONGODB_URI);

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        console.log("MongoDB connected:", connectionInstance.connection.host);
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
}

export default connectDB;