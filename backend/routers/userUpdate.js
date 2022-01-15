const express = require('express');
const pool = require("../db");
const router = new express.Router();

router.get("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await pool.query("SELECT * FROM uzytkownik WHERE id = $1", [id]);
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(400).send(err.message);
    }
});
  
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['imie', 'nazwisko', 'login', 'haslo'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    const { id } = req.params;
    const { imie, nazwisko, login, haslo } = req.body;

    try {
        pool.query(
        "UPDATE uzytkownik SET imie=$1, nazwisko = $2, login = $3, haslo = $4 WHERE id = $5 RETURNING *",
        [imie, nazwisko, login, haslo, id],
        (err, results) => {
            if (err) {
            console.error(err.message);
            res.status(400).send({ error: err.message });
            }
            res.status(200).send(results.rows[0]);
        }
        )
    } catch (err) {
        console.error(err.message);
        res.status(400).send({error: err.message});
    }
});

module.exports = router;