const express = require('express');
const pool = require('../../db');
const areArraysEquals = require('../../utils/utils');
const router = new express.Router();

router.get("/requests/section_status_update", async (req, res) => {
    try {
        const allRequests = await pool.query("SELECT * FROM wniosekoaktualizacje");

        const responseArr = [];

        await Promise.all(allRequests.rows.map(async request => {
            const userRequest = await pool.query(`SELECT * FROM wniosekuzytkownika WHERE id = ${request.wniosekuzytkownikaid}`);
            const user = pool.query(`SELECT * FROM uzytkownik WHERE id = ${userRequest.rows[0].uzytkownikskladajacyid}`);
            const newStatusPool = pool.query(`SELECT * FROM stanodcinka WHERE id = ${request.stanodcinkaid}`);

            const selection = await pool.query(`SELECT * FROM odcinek WHERE id = ${request.odcinekid}`);
            const oldStatusPool = pool.query(`SELECT * FROM stanodcinka WHERE id = ${selection.rows[0].stanodcinkaid}`);


            await Promise.all([user, newStatusPool, oldStatusPool]).then(([userRespose, newStatusPoolResponse, oldStatusPoolResponse]) => {
                const name = userRespose.rows[0].imie;
                const surname = userRespose.rows[0].nazwisko;

                const newStatus = newStatusPoolResponse.rows[0];
                const currentStatus = oldStatusPoolResponse.rows[0];

                const dateOfSubmission = userRequest.rows[0].datazlozenia;
                responseArr.push({
                    requestId: request.wniosekuzytkownikaid,
                    name,
                    surname,
                    newStatus,
                    currentStatus,
                    dateOfSubmission
                });
            });
        }));

        responseArr.sort((a, b) => new Date(b.dateOfSubmission) - new Date(a.dateOfSubmission));

        res.status(200).json(responseArr);
    } catch (err) {
        console.error(err.message);
        res.status(400).json({error: err.message});
    }
});
  
router.get("/requests/section_status_update/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const request = await pool.query(`SELECT * FROM wniosekoaktualizacje WHERE wniosekuzytkownikaid = ${id}`);

        if (request.rows[0] === undefined) {
            return res.status(404).json({error: 'wniosekoaktualizacje NOT FOUND'});
        }

        const userRequest = await pool.query(`SELECT * FROM wniosekuzytkownika WHERE id = ${request.rows[0].wniosekuzytkownikaid}`);
        const user = await pool.query(`SELECT imie, nazwisko FROM uzytkownik WHERE id = ${userRequest.rows[0].uzytkownikskladajacyid}`);
        const newStatusPool = await pool.query(`SELECT * FROM stanodcinka WHERE id = ${request.rows[0].stanodcinkaid}`);
        const selection = await pool.query(`SELECT * FROM odcinek WHERE id = ${request.rows[0].odcinekid}`);
        const currentStatusPool = await pool.query(`SELECT * FROM stanodcinka WHERE id = ${selection.rows[0].stanodcinkaid}`);

        res.status(200).json({
            requestId: request.rows[0].wniosekuzytkownikaid,
            dateOfSubmission: userRequest.rows[0].datazlozenia,
            requester: user.rows[0],
            newStatus: newStatusPool.rows[0],
            currentStatus: {selectionId: selection.rows[0].id, currentStatus: currentStatusPool.rows[0]}, 
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({error: err.message});
    }
});

router.patch('/requests/section_status_update/accept/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const request = await pool.query(`SELECT * FROM wniosekoaktualizacje WHERE wniosekuzytkownikaid = ${id}`);

        if (request.rows[0] === undefined) {
            return res.status(404).json({error: 'wniosekoaktualizacje NOT FOUND'});
        }
        
        const sectionStatusId = request.rows[0].stanodcinkaid;
        const sectionId = request.rows[0].odcinekid;

        const updatedUserRequest = await pool.query(
            `UPDATE wniosekuzytkownika SET datarozpatrzenia = $1, statuswnioskustatus = 'Zaakceptowany' WHERE id = ${id} RETURNING *`,
            [new Date()]
        );

        const updatedSection = await pool.query(`UPDATE odcinek SET stanodcinkaid = ${sectionStatusId} WHERE id = ${sectionId} RETURNING *`);

        const deletedRequest = await pool.query(`DELETE FROM wniosekoaktualizacje WHERE wniosekuzytkownikaid = ${id} RETURNING *`);

        res.status(200).json({
            updatedSection: updatedSection.rows[0], 
            updatedUserRequest: updatedUserRequest.rows[0], 
            deletedSectionStatusUpdateRequest: deletedRequest.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).send({error: err.message});
    }
});

//* PATCH /requests/section_status_update/reject/:id
//* {
//*     "comment":"komentarzyk marynarzyk 123 !@#@%@#*($"
//* }
router.patch('/requests/section_status_update/reject/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['comment'];

    if (!areArraysEquals(updates, allowedUpdates)) {
        return res.status(400).json({ error: 'Invalid updates!' });
    }

    const { id } = req.params;
    const { comment } = req.body;
    try {
        const request = await pool.query(`SELECT * FROM wniosekoaktualizacje WHERE wniosekuzytkownikaid = ${id}`);

        if (request.rows[0] === undefined) {
            return res.status(404).json({error: 'wniosekoaktualizacje NOT FOUND'});
        }
        
        const updatedUserRequest = await pool.query(
            `UPDATE wniosekuzytkownika SET datarozpatrzenia = $1, komentarzzwrotny = '${comment}', statuswnioskustatus = 'Odrzucony' WHERE id = ${id} RETURNING *`,
            [new Date()]
        );

        const deletedRequest = await pool.query(`DELETE FROM wniosekoaktualizacje WHERE wniosekuzytkownikaid = ${id} RETURNING *`,);

        res.status(200).json({
            updatedUserRequest: updatedUserRequest.rows[0], 
            deletedSectionStatusUpdateRequest: deletedRequest.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({error: err.message});
    }
});

module.exports = router;