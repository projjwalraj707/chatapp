import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const pool_context = {
	user: process.env.DB_USERNAME,
	host: process.env.DB_HOST,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
}

const pool = new Pool(pool_context);

pool.on('error', (err, client) => {
	console.error("Unexpected error occured", err);
	process.exit(-1);
});

pool.on("connect", () => {
	console.error("Database connected to the app.")
})

const client = await pool.connect();
export default client;