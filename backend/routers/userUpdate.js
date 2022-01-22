const express = require('express');
const pool = require('../db');
const areArraysEquals = require('../utils/utils');
const router = new express.Router();

router.get("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await pool.query(`SELECT * FROM uzytkownik WHERE id = ${id}`);
        const GOTBookId = user.rows[0].ksiazeczkagotid;

        const GOTBook = await pool.query(`SELECT * FROM ksiazeczkagot WHERE id = ${GOTBookId}`);
        const totalPoints = GOTBook.rows[0].sumarycznepunkty;

        const badges = await pool.query(`SELECT * FROM odznakauzytkownika WHERE ksiazeczkagotid = ${GOTBookId}`);
        const totalBadges = badges.rowCount;

        const trips = await pool.query(`SELECT * FROM wycieczka WHERE ksiazeczkagotid = ${GOTBookId}`);
        const totalTrips = trips.rowCount;

        const role = await pool.query(`SELECT * FROM rolauzytkownika WHERE id = ${user.rows[0].rolauzytkownikaid}`);
        const userRole = role.rows[0].rola;
        user.rows[0].rolanazwa = userRole;

        res.status(200).json({
            user: user.rows[0], 
            totalPoints,
            totalBadges,
            totalTrips,
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({error: err.message});
    }
});
  

//* PATCH /users/:id
//* {
//*     "name": "Kacper",
//*     "surname": "Mikolajczyk",
//*     "login": "kacper.miko",
//*     "password": "haslo123"
//* }
router.patch('/users/:id', async (req, res) => {
    const { id } = req.params;

    const updates = Object.keys(req.body);
    console.log(`PATCHING USER id = ${id}`);
    const allowedUpdates = ['name', 'surname', 'login', 'password'];

    if (!areArraysEquals(updates, allowedUpdates)) {
        return res.status(400).json({ error: 'Invalid updates!' });
    }

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