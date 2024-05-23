const express = require("express");
const config = require("./server/config");
const morgan = require("morgan");
const cors = require("cors");
const routers = require("./server/router");
const path = require("path");
const db = require("./server/database/database.js");

db.connectMongoDB();
db.connectMongoose();

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
// app.use('/', express.static(path.join(__dirname,'public')));

app.use(morgan("dev"));
app.use('/', routers);

app.listen(config.host.port);