import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

console.log("Environment check:");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "SET" : "NOT SET");
console.log("DB_USERNAME:", process.env.DB_USERNAME ? "SET" : "NOT SET");
console.log("DB_HOST:", process.env.DB_HOST ? "SET" : "NOT SET");
console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY ? "SET" : "NOT SET");

const pool_context = process.env.DATABASE_URL
	? {
		connectionString: process.env.DATABASE_URL,
		ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : true
	}
	: {
		user: process.env.DB_USERNAME,
		host: process.env.DB_HOST,
		password: process.env.DB_PASSWORD,
		port: parseInt(process.env.DB_PORT || "5432"),
		database: process.env.DB_NAME,
		ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
	};

console.log("Using database config:", process.env.DATABASE_URL ? "DATABASE_URL" : "individual params");

const pool = new Pool(pool_context);

pool.on('error', (err: any, client: any) => {
	console.error("Unexpected database error:", err);
	process.exit(-1);
});

pool.on("connect", () => {
	console.log("Database connected successfully")
})

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
	if (err) {
		console.error("Database connection test failed:", err);
	} else {
		console.log("Database connection test successful");
	}
});

// const client = await pool.connect();

// export default client;
export default pool;