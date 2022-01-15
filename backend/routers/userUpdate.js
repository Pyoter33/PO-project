const express = require('express');
const pool = require('../db');
const areArraysEquals = require('../utils/utils');
const router = new express.Router();

router.get("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await pool.query(`SELECT * FROM uzytkownik WHERE id = ${id}`);
        res.status(200).json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(400).json({error: err.message});
    }
});
  

//* {
//*     "name": "Kacper",
//*     "surname": "Mikolajczyk",
//*     "login": "kacper.miko",
//*     "password": "haslo123"
//* }
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'surname', 'login', 'password'];

    if (!areArraysEquals(updates, allowedUpdates)) {
        return res.status(400).json({ error: 'Invalid updates!' });
    }

    const { id } = req.params;
    const { name, surname, login, password } = req.body;

    try {
        const updatedUser = await pool.query(
            `UPDATE uzytkownik SET imie = $1, nazwisko = $2, login = $3, haslo = $4 WHERE id = $5 RETURNING *`,
            [name, surname, login, password, id]
        );

        res.status(200).json(updatedUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(400).json({error: err.message});
    }
});

module.exports = router;