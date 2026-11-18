import dotenv from "dotenv";
import connectDB from "./database.js";
import app from "./app.js";

// Load environment variables from .env file
dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8000;

// Connect Database, then start the Express server
connectDB()
  .then((connected) => {
    app.listen(PORT, () => {
      console.log(`\n==================================================`);
      console.log(`⚙️  Server is running at: http://localhost:${PORT}`);
      console.log(`📡 Health Check URL:   http://localhost:${PORT}/`);
      console.log(`👥 Users API URL:      http://localhost:${PORT}/api/v1/users`);
      console.log(`📝 Posts API URL:      http://localhost:${PORT}/api/v1/posts`);
      if (!connected) {
        console.log(`💡 DB Status:          Pending MongoDB Atlas connection string in .env`);
      } else {
        console.log(`💡 DB Status:          Connected to MongoDB Atlas`);
      }
      console.log(`==================================================\n`);
    });
  })
  .catch((err) => {
    console.error("❌ Unexpected server error !! ", err);
  });
