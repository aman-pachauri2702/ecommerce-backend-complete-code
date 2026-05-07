import { config } from "dotenv";
import pkg from "pg";
const { Client } =pkg;
config();
const database=new Client({
    user:process.env.DB_USER,
    host:process.env.DB_host,
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT,
    ssl:{
    required:true,
    }
});
try{
    await database.connect();
    console.log("Connected to the database successfully");
}catch(error){
    console.error("Database connection failed:",error);
    process.exit(1);
}

export default database;
