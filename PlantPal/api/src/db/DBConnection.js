const mariadb = require("mariadb");

let pool;

exports.getDatabaseConnection = () => {
  if (!pool) {
    pool = mariadb.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      charset: process.env.DB_CHARSET,
      bigIntAsNumber: true,
    });
  }
  return pool;
};

exports.query = (query, params = []) => {
  const pool = exports.getDatabaseConnection();
  return pool
    .getConnection()
    .then((conn) => {
      return conn
        .query(query, params)
        .then((res) => {
          conn.release();
          return res;
        })
        .catch((err) => {
          conn.release();
          throw err;
        });
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

exports.close = () => {
  if (pool) {
    pool.end();
    pool = null;
  }
};

// Close gracefully when nodemon restarts the server
process.on("SIGUSR2", () => {
  //   console.debug("process received SIGUSR2 ");
  exports.close();
});
