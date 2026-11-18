import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";

/**
 * Connect to MongoDB Atlas using Mongoose.
 * Uses the connection string from environment variables and appends the database name.
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri || mongoUri === "your_mongodb_connection_string_here") {
      throw new Error(
        "MONGODB_URI is not configured in your .env file. Please paste your MongoDB Atlas connection string."
      );
    }

    // Connect to MongoDB Atlas
    const connectionInstance = await mongoose.connect(`${mongoUri}/${DB_NAME}`);

    console.log(
      `\n✅ MongoDB connected successfully! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("❌ MongoDB connection FAILED:", error.message);
    process.exit(1);
  }
};

export default connectDB;
