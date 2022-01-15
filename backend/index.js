const express = require("express");
const cors = require("cors");
const pool = require("./db");

const userUpdate = require("./routers/userUpdate");
const createOwnSection = require("./routers/createOwnSection");
const tripRequest = require("./routers/requests/tripRequest");
const updateSectionRequest = require("./routers/requests/updateSectionRequest");

const app = express();

app.use(cors());
app.use(express.json());

// TODO: REANAME ENDPOINTS | CLEAN CODE | ADD RESPONSE STATUSES | SPLIT INTO SEPERATE FILES

app.use(userUpdate);
app.use(createOwnSection);
app.use(tripRequest);
app.use(updateSectionRequest);

// ?CONSIDER SELECTION STATUS UPDATE REQUEST
// app.get("/requests/update_selection_status", async (req, res) => {
//   try {
//     const allUpdateRequests = await pool.query("SELECT * FROM wniosekoaktualizacje");

//     const resArr = [];

//     await Promise.all(allUpdateRequests.rows.map(async request => {
//       const userRequest = await pool.query("SELECT * FROM wniosekuzytkownika WHERE id = $1", [request.wniosekuzytkownikaid]);
//       const user = pool.query("SELECT * FROM uzytkownik WHERE id = $1", [userRequest.rows[0].uzytkownikskladajacyid]);
//       const newStatusPool = pool.query("SELECT * FROM stanodcinka WHERE id = $1", [request.stanodcinkaid]);

//       const selection = await pool.query("SELECT * FROM odcinek WHERE id = $1", [request.odcinekid]);
//       const oldStatusPool = pool.query("SELECT * FROM stanodcinka WHERE id = $1", [selection.rows[0].stanodcinkaid]);


//       await Promise.all([user, newStatusPool, oldStatusPool]).then(function([userResult, newStatusPoolResult, oldStatusPoolResult]) {
//         const name = userResult.rows[0].imie;
//         const surname = userResult.rows[0].nazwisko;
//         const newStatus = newStatusPoolResult.rows[0].statusodcinkastatus;
//         const oldStatus = oldStatusPoolResult.rows[0].statusodcinkastatus;
//         resArr.push({
//           requestId: request.wniosekuzytkownikaid,
//           name,
//           surname,
//           newStatus,
//           oldStatus,
//         });
//       });
//     }));

//     res.json(resArr);
//   } catch (err) {
//     console.error(err.message);
//     res.status(400).json({error: err.message});
//   }
// });

// app.get("/requests/update_selection_status/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const updateRequests = await pool.query("SELECT * FROM wniosekoaktualizacje WHERE wniosekuzytkownikaid = $1", [id]);

//     const userRequest = await pool.query("SELECT * FROM wniosekuzytkownika WHERE id = $1", [updateRequests.rows[0].wniosekuzytkownikaid]);
//     const user = await pool.query("SELECT imie, nazwisko FROM uzytkownik WHERE id = $1", [userRequest.rows[0].uzytkownikskladajacyid]);
//     const newStatusPool = await pool.query("SELECT * FROM stanodcinka WHERE id = $1", [updateRequests.rows[0].stanodcinkaid]);
//     const selection = await pool.query("SELECT * FROM odcinek WHERE id = $1", [updateRequests.rows[0].odcinekid]);
//     const currentStatusPool = await pool.query("SELECT * FROM stanodcinka WHERE id = $1", [selection.rows[0].stanodcinkaid]);

//     res.json({
//       requestId: updateRequests.rows[0].wniosekuzytkownikaid,
//       dateOfSubmission: userRequest.rows[0].datazlozenia,
//       requester: user.rows[0],
//       newStatus: newStatusPool.rows[0],
//       currentStatus: {selectionId: selection.rows[0].id, currentStatus: currentStatusPool.rows[0]}, 
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(400).json({error: err.message});
//   }
// });


// //* JEZELI admin rozpatrzy OK
// //*    to DELETE wniosek o aktualizacje
// //*       UPDATE wnioski uzytkownika (komentarz = NULL, datarozpatrzenia = DATE)
// //*       UPDATE odcinek (o stan odcinka z tabeli stanodcinka)
// //* ELSE (Jezeli rozpatrzy NEGATYWNIE)
// //*   to DELETE wniosek o aktualizacje
// //*      UPDATE wnioski uzytkownika (komentarz = STRING, datarozpatrzenia = DATE)

// app.patch('/requests/update_selection_status/accept/:id', async (req, res) => {
//   const wniosekuzytkownikaid = req.params.id;

//   const datarozpatrzenia = new Date();

//   let x = {};
//   try {
//     const singleUpdateSelectionStatusRequest = await pool.query("SELECT * FROM wniosekoaktualizacje WHERE wniosekuzytkownikaid = $1", [wniosekuzytkownikaid]);
//     x = singleUpdateSelectionStatusRequest.rows[0];
//   } catch (err) {
//     console.error(err.message);
//     return res.status(400).send(err.message);
//   }

//   if (x === undefined) {
//     return res.status(400).send('wniosekoaktualizacje NOT FOUND');
//   }

//   const stanodcinkaid = x.stanodcinkaid;
//   const odcinekid = x.odcinekid;

//   try {
//     // DELETE wniosek o aktualizacje 
//     const deleteResult = await pool.query(
//       "DELETE FROM wniosekoaktualizacje WHERE wniosekuzytkownikaid = $1 RETURNING *",
//       [wniosekuzytkownikaid]
//     );
//     const res1 = deleteResult.rows[0];

//     const newStatus = "Zaakceptowany";
//     // UPDATE wnioski uzytkownika (komentarz = NULL (BEZ ZMIAN), datarozpatrzenia = DATE)
//     const updateUserRequestsResult = await pool.query(
//       "UPDATE wniosekuzytkownika SET datarozpatrzenia = $1, statuswnioskustatus = $2 WHERE id = $3 RETURNING *",
//       [datarozpatrzenia, newStatus, wniosekuzytkownikaid]
//     );
//     const res2 = updateUserRequestsResult.rows[0];

//     // UPDATE odcinek (o stan odcinka z tabeli stanodcinka)
//     const updateSelectionRequest = await pool.query(
//       "UPDATE odcinek SET stanodcinkaid = $1 WHERE id = $2 RETURNING *", [stanodcinkaid, odcinekid]);
//     const res3 = updateSelectionRequest.rows[0];

//     res.status(200).send({res1, res2, res3});
//   } catch (err) {
//     console.error(err.message);
//     res.status(400).send({error: err.message});
//   }
// });

// app.patch('/requests/update_selection_status/reject/:id', async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = ['komentarzzwrotny'];
//   //const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
//   const isValidOperation = arrayEquals(allowedUpdates, updates);

//   if (!isValidOperation) {
//     return res.status(400).send({ error: 'Invalid updates!' });
//   }

//   const wniosekuzytkownikaid = req.params.id;
//   const { komentarzzwrotny } = req.body;
//   const datarozpatrzenia = new Date();

//   let x = {};
//   try {
//     const singleUpdateSelectionStatusRequest = await pool.query("SELECT * FROM wniosekoaktualizacje WHERE wniosekuzytkownikaid = $1", [wniosekuzytkownikaid]);
//     x = singleUpdateSelectionStatusRequest.rows[0];
//   } catch (err) {
//     console.error(err.message);
//     return res.status(400).json(err.message);
//   }

//   if (x === undefined) {
//     return res.status(400).json('wniosekoaktualizacje NOT FOUND');
//   }

//   try {
//     // DELETE wniosek o aktualizacje 
//     const deleteResult = await pool.query(
//       "DELETE FROM wniosekoaktualizacje WHERE wniosekuzytkownikaid = $1 RETURNING *",
//       [wniosekuzytkownikaid]
//     );
//     const res1 = deleteResult.rows[0];

//     const newStatus = "Odrzucony";
//     // UPDATE wnioski uzytkownika (komentarzzwrotny = STRING, datarozpatrzenia = DATE)
//     const updateUserRequestsResult = await pool.query(
//       "UPDATE wniosekuzytkownika SET datarozpatrzenia = $1, komentarzzwrotny = $2, statuswnioskustatus = $3 WHERE id = $4 RETURNING *",
//       [datarozpatrzenia, komentarzzwrotny, newStatus, wniosekuzytkownikaid]
//     );
//     const res2 = updateUserRequestsResult.rows[0];

//     return res.status(200).json({res1, res2});
//   } catch (err) {
//     console.error(err.message);
//     res.status(400).json({error: err.message});
//   }
// });

app.listen(5000, () => {
  console.log("server has started on port 5000");
});

const arrayEquals = (a, b) => {
  return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
}