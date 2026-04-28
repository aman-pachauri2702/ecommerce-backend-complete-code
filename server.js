import app from "./app.js";
import pool from "./database/db.js";// ✅ IMPORTANT (add this)
import { v2 as cloudinary } from "cloudinary";

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

// start server ONLY after DB is ready
const startServer = async () => {
  try {
    await pool.query("SELECT 1"); // ✅ test DB connection

    console.log("✅ Database connected");

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to connect DB:", error);
    process.exit(1);
  }
};

startServer();
