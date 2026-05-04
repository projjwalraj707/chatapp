import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const pool_context = process.env.DATABASE_URL
	? {
		connectionString: process.env.DATABASE_URL,
		ssl: { rejectUnauthorized: false }
	}
	: {
		user: process.env.DB_USERNAME,
		host: process.env.DB_HOST,
		password: process.env.DB_PASSWORD,
		port: parseInt(process.env.DB_PORT || "5432"),
		database: process.env.DB_NAME,
	};

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