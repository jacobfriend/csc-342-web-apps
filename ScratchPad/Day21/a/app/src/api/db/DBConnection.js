const mariadb = require('mariadb');

// Stores the connection pool to the database
let pool;

exports.getDatabaseConnection = () => {
	if (!pool) {
		// Create a new connection pool
    pool = mariadb.createPool({
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			user: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD,
			database: process.env.MYSQL_DATABASE,
			charset: process.env.DB_CHARSET
		});
	}
	return pool;
};

exports.query = (query, params = []) => {
	const pool = exports.getDatabaseConnection();
	// Returns a promise with the result of the query
	return pool.query(query, params).catch(err => {
		console.log(err);
		throw err;
	});
}

exports.close = () => {
	if (pool) {
    pool.end();
		pool = null;
  }
}