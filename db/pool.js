import { Pool } from "pg";
import { config } from "dotenv";
config();

const pool = new Pool({
    connectionString: process.env.DB_CONNECTION_URL
});

export default pool;