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

// TODO: REANAME ENDPOINTS | CLEAN CODE | ADD RESPONSE STATUSES

app.use(userUpdate);
app.use(createOwnSection);
app.use(tripRequest);
app.use(updateSectionRequest);

app.listen(5000, () => {
  console.log("server has started on port 5000");
});