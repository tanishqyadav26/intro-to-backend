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
      console.warn(
        "\n⚠️  Notice: MONGODB_URI is not yet configured in your .env file."
      );
      console.warn(
        "➡️  Paste your MongoDB Atlas connection string in .env to connect to the cloud database.\n"
      );
      return false;
    }

    // Connect to MongoDB Atlas
    const connectionInstance = await mongoose.connect(`${mongoUri}/${DB_NAME}`);

    console.log(
      `\n✅ MongoDB connected successfully! DB Host: ${connectionInstance.connection.host}`
    );
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection FAILED:", error.message);
    return false;
  }
};

export default connectDB;
