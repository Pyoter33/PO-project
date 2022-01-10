const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/users", async (req, res) => {
    try {
      const allTodos = await pool.query("SELECT * FROM uzytkownik");
      res.json(allTodos.rows);
    } catch (err) {
      console.error(err.message);
    }
  });


app.listen(5000, () => {
  console.log("server has started on port 5000");
});