const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "2137",
  host: "localhost",
  port: 5432,
  database: "PO_DB"
});

module.exports = pool;