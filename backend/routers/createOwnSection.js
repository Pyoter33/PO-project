const express = require('express');
const pool = require("../db");
const router = new express.Router();

router.get("/sections", async (req, res) => {
    try {
        const allSections = await pool.query("SELECT * FROM odcinek");
        res.json(allSections.rows);
    } catch (err) {
        console.error(err.message);
        res.status(400).send(err.message);
    }
});

router.get("/points", async (req, res) => {
    try {
        const allPoints = await pool.query("SELECT * FROM punkt");
        res.json(allPoints.rows);
    } catch (err) {
        console.error(err.message);
        res.status(400).send(err.message);
    }
});

router.post("/sections", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['uzytkownikid', 'dlugosc', 'przewyzszenie', 'punkty', 'punktpoczatkowyid', 'punktkoncowyid'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    const { uzytkownikid, dlugosc, przewyzszenie, punkty, punktpoczatkowyid, punktkoncowyid } = req.body;

    try {
        const allSections = await pool.query("SELECT * FROM odcinek");
        const userStartPoint = await pool.query("SELECT * FROM punkt WHERE id = $1", [punktpoczatkowyid]);
        const userEndPoint = await pool.query("SELECT * FROM punkt WHERE id = $1", [punktkoncowyid]);

        const startPointRange = userStartPoint.rows[0].pasmonazwa;
        const endPointRange = userEndPoint.rows[0].pasmonazwa;

        const arePointsInSameRange = startPointRange === endPointRange;
        if (!arePointsInSameRange) {
        throw Error("Selected points do not lie in the same mountain range!");
        }

        const isSectionExists = allSections.rows.some(section => section.punktpoczatkowyid == punktpoczatkowyid && section.punktkoncowyid == punktkoncowyid);
        if (isSectionExists) {
        throw Error("Section with the given start and end point already exists!");
        }

        const newSectionsStatus = await pool.query("INSERT INTO stanodcinka (statusodcinkastatus, datarozpoczeciastanu, opis, datazakonczeniastanu) VALUES ($1, $2, $3, $4) RETURNING *", ["Otwarty", new Date(), `Stworzony przez użytkownika o id: ${uzytkownikid}`, null]);
        const { id } = newSectionsStatus.rows[0];
        const newSection = await pool.query("INSERT INTO odcinek (uzytkownikid, dlugosc, przewyzszenie, punkty, stanodcinkaid, punktpoczatkowyid, punktkoncowyid) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [uzytkownikid, dlugosc, przewyzszenie, punkty, id, punktpoczatkowyid, punktkoncowyid]);
        
        res.status(200).json({createdSection: newSection.rows[0], createdSectionStatus: newSectionsStatus.rows[0]});
    } catch (err) {
        console.error(err.message);
        res.status(400).json({error: err.message});
    }
});

  module.exports = router;