import pkg from "pg";
import { config } from "dotenv";
const { Pool } = pkg;

config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction
        ? { rejectUnauthorized: false } // ✅ for Neon / Render
        : false // ✅ for local PostgreSQL
});

pool.on("connect", () => {
    console.log("✅ database connected successfully");
});

pool.on("error", (err) => {
    console.error("❌ DB error:", err);
});

export default pool;
