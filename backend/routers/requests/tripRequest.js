const express = require('express');
const pool = require("../../db");
const areArraysEquals = require('../../utils/utils');
const router = new express.Router();

router.get("/requests/trip_acceptation", async (req, res) => {
    try {
        const allRequests = await pool.query("SELECT * FROM wniosekoakceptacje");

        const responseArr = [];

        await Promise.all(allRequests.rows.map(async request => {
            const userRequest = await pool.query(`SELECT * FROM wniosekuzytkownika WHERE id = ${request.wniosekuzytkownikaid}`);
            const userTrip = pool.query(`SELECT * FROM wycieczka WHERE id = ${request.wycieczkaid}`);
            
            const user = pool.query(`SELECT * FROM uzytkownik WHERE id = ${userRequest.rows[0].uzytkownikskladajacyid}`);

            await Promise.all([userTrip, user]).then(([userTripResponse, userResponse]) => {
                const points = userTripResponse.rows[0].liczbapunktow;
                const name = userResponse.rows[0].imie;
                const surname = userResponse.rows[0].nazwisko;
                responseArr.push({requestId: request.wniosekuzytkownikaid, name, surname, points});
            });
        }));

        res.status(200).json(responseArr);
    } catch (err) {
        console.error(err.message);
        res.status(400).json({error: err.message});
    }
});

router.get("/requests/trip_acceptation/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const request = await pool.query("SELECT * FROM wniosekoakceptacje WHERE wniosekuzytkownikaid = $1", [id]);
        const userRequest = await pool.query(`SELECT * FROM wniosekuzytkownika WHERE id = ${request.rows[0].wniosekuzytkownikaid}`);
        const userTrip = await pool.query(`SELECT * FROM wycieczka WHERE id = ${request.rows[0].wycieczkaid}`);
        const user = await pool.query(`SELECT * FROM uzytkownik WHERE id = ${userRequest.rows[0].uzytkownikskladajacyid}`);
        
        const dateOfSubmission = userRequest.rows[0].datazlozenia;
        const points = userTrip.rows[0].liczbapunktow;
        const startDate = userTrip.rows[0].datarozpoczecia;
        const endDate = userTrip.rows[0].datazakonczenia;
        const timeTripInMinutes = (endDate - startDate) / 60 / 1000;
        const name = user.rows[0].imie;
        const surname = user.rows[0].nazwisko;

        res.status(200).json({
            requestId: request.rows[0].wniosekuzytkownikaid,
            name, 
            surname, 
            points, 
            dateOfSubmission,
            startDate,
            endDate,
            timeTripInMinutes,
            photo: request.rows[0].zdjeciezrodlo,
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({error: err.message});
    }
});

router.patch('/requests/trip_acceptation/accept/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const request = await pool.query(`SELECT * FROM wniosekoakceptacje WHERE wniosekuzytkownikaid = ${id}`);

        if (request.rows[0] === undefined) {
            return res.status(404).json({error: 'wniosekoakceptacje NOT FOUND'});
        }
    
        const tripId = request.rows[0].wycieczkaid;

        const updatedUserRequest = await pool.query(
            `UPDATE wniosekuzytkownika SET datarozpatrzenia = $1, statuswnioskustatus = 'Zaakceptowany' WHERE id = ${id} RETURNING *`,
            [new Date()]
        );

        const updatedTrip = await pool.query(`UPDATE wycieczka SET statuswycieczkistatus = 'Zaakceptowana' WHERE id = ${tripId} RETURNING *`);

        const deletedTripAcceptationRequest = await pool.query(
            `DELETE FROM wniosekoakceptacje WHERE wniosekuzytkownikaid = ${id} RETURNING *`,
        );

        res.status(200).json({
            updatedTrip: updatedTrip.rows[0], 
            updatedUserRequest: updatedUserRequest.rows[0], 
            deletedUpdateRequest: deletedTripAcceptationRequest.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({error: err.message});
    }
});

//* PATCH /requests/trip_acceptation/reject/:id
//* {
//*     "comment":"komentarzyk marynarzyk 123 !@#@%@#*($"
//* }
router.patch('/requests/trip_acceptation/reject/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['comment'];

    if (!areArraysEquals(updates, allowedUpdates)) {
        return res.status(400).json({ error: 'Invalid updates!' });
    }

    const { id } = req.params;
    const { comment } = req.body;
    try {
        const request = await pool.query(`SELECT * FROM wniosekoakceptacje WHERE wniosekuzytkownikaid = ${id}`);

        if (request.rows[0] === undefined) {
            return res.status(404).json({error: 'wniosekoakceptacje NOT FOUND'});
        }
    
        const tripId = request.rows[0].wycieczkaid;

        const updatedUserRequest = await pool.query(
            `UPDATE wniosekuzytkownika SET datarozpatrzenia = $1, komentarzzwrotny = '${comment}', statuswnioskustatus = 'Odrzucony' WHERE id = ${id} RETURNING *`,
            [new Date()]
        );

        const updatedTrip = await pool.query(`UPDATE wycieczka SET statuswycieczkistatus = 'Odrzucona' WHERE id = ${tripId} RETURNING *`);

        const deletedTripAcceptationRequest = await pool.query(
            `DELETE FROM wniosekoakceptacje WHERE wniosekuzytkownikaid = ${id} RETURNING *`,
        );

        res.status(200).json({
            updatedTrip: updatedTrip.rows[0], 
            updatedUserRequest: updatedUserRequest.rows[0], 
            deletedUpdateRequest: deletedTripAcceptationRequest.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({error: err.message});
    }
});

module.exports = router;