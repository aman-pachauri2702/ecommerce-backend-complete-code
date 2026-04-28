import { config } from "dotenv";
import pkg from "pg";
const { Client } = pkg;

config();

const database = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,

    // ✅ ADD THIS
    ssl: {
        rejectUnauthorized: false
    }
});

try {
    await database.connect();
    console.log("database connected successfully");
} catch (error) {
    console.error("database connection failed:", error);
    process.exit(1);
}

export default database;
