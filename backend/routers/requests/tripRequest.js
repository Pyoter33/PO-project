const express = require('express');
const pool = require("../../db");
const router = new express.Router();

router.get("/requests/accept_trip", async (req, res) => {
    try {
        const allAcceptTripRequests = await pool.query("SELECT * FROM wniosekoakceptacje");

        const resArr = [];

        await Promise.all(allAcceptTripRequests.rows.map(async request => {
            const userRequest = await pool.query("SELECT * FROM wniosekuzytkownika WHERE id = $1", [request.wniosekuzytkownikaid]);
            const userTrip = pool.query("SELECT * FROM wycieczka WHERE id = $1", [request.wycieczkaid]);
            
            const user = pool.query("SELECT * FROM uzytkownik WHERE id = $1", [userRequest.rows[0].uzytkownikskladajacyid]);

            await Promise.all([userTrip, user]).then(function([resultA, resultB]) {
                const points = resultA.rows[0].liczbapunktow;
                const name = resultB.rows[0].imie;
                const surname = resultB.rows[0].nazwisko;
                resArr.push({requestId: request.wniosekuzytkownikaid, name, surname, points});
            });
        }));

        res.json(resArr);
    } catch (err) {
        console.error(err.message);
        res.status(400).json({error: err.message});
    }
});

router.get("/requests/accept_trip/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const allAcceptTripRequests = await pool.query("SELECT * FROM wniosekoakceptacje WHERE wniosekuzytkownikaid = $1", [id]);

        let response = {};

        await Promise.all(allAcceptTripRequests.rows.map(async request => {
            const userRequest = await pool.query("SELECT * FROM wniosekuzytkownika WHERE id = $1", [request.wniosekuzytkownikaid]);
            const userTrip = await pool.query("SELECT * FROM wycieczka WHERE id = $1", [request.wycieczkaid]);
            
            const user = await pool.query("SELECT * FROM uzytkownik WHERE id = $1", [userRequest.rows[0].uzytkownikskladajacyid]);
            
            const dateOfSubmission = userRequest.rows[0].datazlozenia;
            const points = userTrip.rows[0].liczbapunktow;
            const startDate = userTrip.rows[0].datarozpoczecia;
            const endDate = userTrip.rows[0].datazakonczenia;
            const timeTripInMinutes = (endDate - startDate) / 60 / 1000;
            const name = user.rows[0].imie;
            const surname = user.rows[0].nazwisko;
            response = {
                requestId: request.wniosekuzytkownikaid,
                name, 
                surname, 
                points, 
                dateOfSubmission,
                startDate,
                endDate,
                timeTripInMinutes,
                photo: request.zdjeciezrodlo,
            };
        }));

        res.json(response);
    } catch (err) {
        console.error(err.message);
        res.status(400).json({error: err.message});
    }
});


//* JEZELI przodownik rozpatrzy OK
//*    to DELETE wniosek o akceptacje
//*       UPDATE wnioski uzytkownika (komentarz = NULL, datarozpatrzenia = DATE, statuswnioski = ZAAKCEPTOWANY)
//*       UPDATE wycieczka (na Zaakceptowana)
//* ELSE (Jezeli rozpatrzy NEGATYWNIE)
//*   to DELETE wniosek o aktualizacje
//*      UPDATE wnioski uzytkownika (komentarz = STRING, datarozpatrzenia = DATE, statuswniosku = ODRZUCONY)
//*       UPDATE wycieczka (na Odrzucona)

router.patch('/requests/accept_trip/accept/:id', async (req, res) => {
    const userRequestId = req.params.id;

    const dateOfConsideration = new Date();

    let request = {};
    try {
        const singleUpdateSelectionStatusRequest = await pool.query("SELECT * FROM wniosekoakceptacje WHERE wniosekuzytkownikaid = $1", [userRequestId]);
        request = singleUpdateSelectionStatusRequest.rows[0];
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({error: err.message});
    }

    if (request === undefined) {
        return res.status(404).json({error: 'wniosekoakceptacje NOT FOUND'});
    }

    const tripId = request.wycieczkaid;

    try {
        // DELETE wniosek o akceptacje 
        const deleteResult = await pool.query(
        "DELETE FROM wniosekoakceptacje WHERE wniosekuzytkownikaid = $1 RETURNING *",
        [userRequestId]
        );

        const newStatus = "Zaakceptowany";
        // UPDATE wnioski uzytkownika (komentarz = NULL (BEZ ZMIAN), datarozpatrzenia = DATE)
        const updateUserRequestsResult = await pool.query(
        "UPDATE wniosekuzytkownika SET datarozpatrzenia = $1, statuswnioskustatus = $2 WHERE id = $3 RETURNING *",
        [dateOfConsideration, newStatus, userRequestId]
        );

        // UPDATE wycieczka (na Zaakceptowana)
        const newTripStatus = "Zaakceptowana";
        const updateTrip = await pool.query("UPDATE wycieczka SET statuswycieczkistatus = $1 WHERE id = $2 RETURNING *", [newTripStatus, tripId]);

        res.status(200).json({
            updatedTrip: updateTrip.rows[0], 
            updatedUserRequest: updateUserRequestsResult.rows[0], 
            deletedUpdateRequest: deleteResult.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({error: err.message});
    }
});

router.patch('/requests/accept_trip/reject/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['komentarzzwrotny'];
    const isValidOperation = arrayEquals(allowedUpdates, updates);

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }


    const userRequestId = req.params.id;
    const { komentarzzwrotny } = req.body;
    const dateOfConsideration = new Date();

    let request = {};
    try {
        const singleUpdateSelectionStatusRequest = await pool.query("SELECT * FROM wniosekoakceptacje WHERE wniosekuzytkownikaid = $1", [userRequestId]);
        request = singleUpdateSelectionStatusRequest.rows[0];
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({error: err.message});
    }

    if (request === undefined) {
        return res.status(404).json({error: 'wniosekoakceptacje NOT FOUND'});
    }

    const tripId = request.wycieczkaid;

    try {
        // DELETE wniosek o akceptacje 
        const deleteResult = await pool.query(
        "DELETE FROM wniosekoakceptacje WHERE wniosekuzytkownikaid = $1 RETURNING *",
        [userRequestId]
        );
        
        const newStatus = "Odrzucony";
        // UPDATE wnioski uzytkownika (komentarzzwrotny = STRING, datarozpatrzenia = DATE)
        const updateUserRequestsResult = await pool.query(
        "UPDATE wniosekuzytkownika SET datarozpatrzenia = $1, komentarzzwrotny = $2, statuswnioskustatus = $3 WHERE id = $4 RETURNING *",
        [dateOfConsideration, komentarzzwrotny, newStatus, userRequestId]
        );

        // UPDATE wycieczka (na Odrzucona)
        const newTripStatus = "Odrzucona";
        const updateTrip = await pool.query("UPDATE wycieczka SET statuswycieczkistatus = $1 WHERE id = $2 RETURNING *", [newTripStatus, tripId]);

        return res.status(200).json({
            updatedTrip: updateTrip.rows[0], 
            updatedUserRequest: updateUserRequestsResult.rows[0], 
            deleteRequest: deleteResult.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({error: err.message});
    }
});

const arrayEquals = (a, b) => {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

module.exports = router;