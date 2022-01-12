const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// user account update
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await pool.query("SELECT * FROM uzytkownik WHERE id = $1", [id]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(400).send(err.message);
  }
});

app.patch('/users/:id', async (req, res) => {
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

// create own section
app.get("/sections", async (req, res) => {
  try {
    const allSections = await pool.query("SELECT * FROM odcinek");
    res.json(allSections.rows);
  } catch (err) {
    console.error(err.message);
    res.status(400).send(err.message);
  }
});

app.get("/points", async (req, res) => {
  try {
    const allPoints = await pool.query("SELECT * FROM punkt");
    res.json(allPoints.rows);
  } catch (err) {
    console.error(err.message);
    res.status(400).send(err.message);
  }
});

// consider the request for acceptance of the trip
app.get("/requests/accept_trip", async (req, res) => {
  try {
    const allAcceptTrupRequests = await pool.query("SELECT * FROM wniosekoakceptacje");
    res.json(allAcceptTrupRequests.rows);
  } catch (err) {
    console.error(err.message);
    res.status(400).send(err.message);
  }
});

app.get("/requests/accept_trip/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const allAcceptTrupRequests = await pool.query("SELECT * FROM wniosekoakceptacje WHERE wniosekuzytkownikaid = $1", [id]);
    res.json(allAcceptTrupRequests.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(400).send(err.message);
  }
});

// consider selection status update request
app.get("/requests/update_selection_status", async (req, res) => {
  try {
    const allAcceptTrupRequests = await pool.query("SELECT * FROM wniosekoaktualizacje");
    res.json(allAcceptTrupRequests.rows);
  } catch (err) {
    console.error(err.message);
    res.status(400).send(err.message);
  }
});


app.get("/requests/update_selection_status/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const allAcceptTrupRequests = await pool.query("SELECT * FROM wniosekoaktualizacje WHERE wniosekuzytkownikaid = $1", [id]);
    res.json(allAcceptTrupRequests.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(400).send(err.message);
  }
});


// JEZELI admin rozpatrzy OK
//    to DELETE wniosek o aktualizacje
//       UPDATE wnioski uzytkownika (komentarz = NULL, datarozpatrzenia = DATE)
//       UPDATE odcinek (o stan odcinka z tabeli stanodcinka)
// ELSE (Jezeli rozpatrzy NEGATYWNIE)
//   to DELETE wniosek o aktualizacje
//      UPDATE wnioski uzytkownika (komentarz = STRING, datarozpatrzenia = DATE)

app.patch('/requests/update_selection_status/accept/:id', async (req, res) => {
  const wniosekuzytkownikaid = req.params.id;

  const datarozpatrzenia = new Date();

  let x = {};
  try {
    const singleUpdateSelectionStatusRequest = await pool.query("SELECT * FROM wniosekoaktualizacje WHERE wniosekuzytkownikaid = $1", [wniosekuzytkownikaid]);
    x = singleUpdateSelectionStatusRequest.rows[0];
  } catch (err) {
    console.error(err.message);
    return res.status(400).send(err.message);
  }

  if (x === undefined) {
    return res.status(400).send('wniosekoaktualizacje NOT FOUND');
  }

  const stanodcinkaid = x.stanodcinkaid;
  const odcinekid = x.odcinekid;

  try {
    // DELETE wniosek o aktualizacje 
    const deleteResult = await pool.query(
      "DELETE FROM wniosekoaktualizacje WHERE wniosekuzytkownikaid = $1 RETURNING *",
      [wniosekuzytkownikaid]
    );
    const res1 = deleteResult.rows[0];

    const newStatus = "Zaakceptowany";
    // UPDATE wnioski uzytkownika (komentarz = NULL (BEZ ZMIAN), datarozpatrzenia = DATE)
    const updateUserRequestsResult = await pool.query(
      "UPDATE wniosekuzytkownika SET datarozpatrzenia = $1, statuswnioskustatus = $2 WHERE id = $3 RETURNING *",
      [datarozpatrzenia, newStatus, wniosekuzytkownikaid]
    );
    const res2 = updateUserRequestsResult.rows[0];

    // UPDATE odcinek (o stan odcinka z tabeli stanodcinka)
    const updateSelectionRequest = await pool.query(
      "UPDATE odcinek SET stanodcinkaid = $1 WHERE id = $2 RETURNING *", [stanodcinkaid, odcinekid]);
    const res3 = updateSelectionRequest.rows[0];

    res.status(200).send({res1, res2, res3});
  } catch (err) {
    console.error(err.message);
    res.status(400).send({error: err.message});
  }
});

app.patch('/requests/update_selection_status/reject/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['komentarzzwrotny'];
  //const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  const isValidOperation = arrayEquals(allowedUpdates, updates);

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  const wniosekuzytkownikaid = req.params.id;
  const { komentarzzwrotny } = req.body;
  const datarozpatrzenia = new Date();

  let x = {};
  try {
    const singleUpdateSelectionStatusRequest = await pool.query("SELECT * FROM wniosekoaktualizacje WHERE wniosekuzytkownikaid = $1", [wniosekuzytkownikaid]);
    x = singleUpdateSelectionStatusRequest.rows[0];
  } catch (err) {
    console.error(err.message);
    return res.status(400).json(err.message);
  }

  if (x === undefined) {
    return res.status(400).json('wniosekoaktualizacje NOT FOUND');
  }

  try {
    // DELETE wniosek o aktualizacje 
    const deleteResult = await pool.query(
      "DELETE FROM wniosekoaktualizacje WHERE wniosekuzytkownikaid = $1 RETURNING *",
      [wniosekuzytkownikaid]
    );
    const res1 = deleteResult.rows[0];

    const newStatus = "Odrzucony";
    // UPDATE wnioski uzytkownika (komentarzzwrotny = STRING, datarozpatrzenia = DATE)
    const updateUserRequestsResult = await pool.query(
      "UPDATE wniosekuzytkownika SET datarozpatrzenia = $1, komentarzzwrotny = $2, statuswnioskustatus = $3 WHERE id = $4 RETURNING *",
      [datarozpatrzenia, komentarzzwrotny, newStatus, wniosekuzytkownikaid]
    );
    const res2 = updateUserRequestsResult.rows[0];

    return res.status(200).json({res1, res2});
  } catch (err) {
    console.error(err.message);
    res.status(400).json({error: err.message});
  }
});

app.listen(5000, () => {
  console.log("server has started on port 5000");
});

const arrayEquals = (a, b) => {
  return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
}