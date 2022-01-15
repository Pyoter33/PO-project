const express = require('express');
const pool = require("../db");
const areArraysEquals = require('../utils/utils');
const router = new express.Router();

//* GET /sections
router.get("/sections", async (req, res) => {
    try {
        const sections = await pool.query("SELECT * FROM odcinek");
        res.status(200).json(sections.rows);
    } catch (err) {
        console.error(err.message);
        res.status(400).json(err.message);
    }
});

//* GET /points
router.get("/points", async (req, res) => {
    try {
        const points = await pool.query("SELECT * FROM punkt");
        res.status(200).json(points.rows);
    } catch (err) {
        console.error(err.message);
        res.status(400).json(err.message);
    }
});

//* POST /sections
//* {
//*     "userId": "1",
//*     "length": "1.2",
//*     "deflection": "2.3",
//*     "points": "10",
//*     "startPoint": "2",
//*     "endPoint": "1"
//* }
router.post("/sections", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['userId', 'length', 'deflection', 'points', 'startPoint', 'endPoint'];

    if (!areArraysEquals(updates, allowedUpdates)) {
        return res.status(400).json({ error: 'Invalid updates!' });
    }

    const { userId, length, deflection, points, startPoint, endPoint } = req.body;

    try {
        const allSections = await pool.query("SELECT * FROM odcinek");
        const userStartPoint = await pool.query(`SELECT * FROM punkt WHERE id = ${startPoint}`);
        const userEndPoint = await pool.query(`SELECT * FROM punkt WHERE id = ${endPoint}`);

        const startPointRange = userStartPoint.rows[0].pasmonazwa;
        const endPointRange = userEndPoint.rows[0].pasmonazwa;

        const arePointsInSameRange = startPointRange === endPointRange;
        if (!arePointsInSameRange) {
            return res.status(400).json({ error: 'Selected points do not lie in the same mountain range!' });
        }

        const isSectionExists = allSections.rows.some(section => section.punktpoczatkowyid == startPoint && section.punktkoncowyid == endPoint);
        if (isSectionExists) {
            return res.status(400).json({ error: 'Section with the given start and end point already exists!' });
        }

        const newSectionStatus = await pool.query(
            `INSERT INTO stanodcinka (statusodcinkastatus, datarozpoczeciastanu, opis, datazakonczeniastanu) VALUES ('Otwarty', $1, '${`Stworzony przez użytkownika o id: ${userId}`}', ${null}) RETURNING *`,
            [new Date()]
        );
        const { id } = newSectionStatus.rows[0];
        const newSection = await pool.query(
            `INSERT INTO odcinek (uzytkownikid, dlugosc, przewyzszenie, punkty, stanodcinkaid, punktpoczatkowyid, punktkoncowyid) VALUES (${userId}, ${length}, ${deflection}, ${points}, ${id}, ${startPoint}, ${endPoint}) RETURNING *`, 
        );
        
        res.status(200).json({createdSection: newSection.rows[0], createdSectionStatus: newSectionStatus.rows[0]});
    } catch (err) {
        console.error(err.message);
        res.status(400).json({error: err.message});
    }
});

  module.exports = router;