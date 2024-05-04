const express = require("express");
const config = require("./public/config.js");
const morgan = require("morgan");
const cors = require("cors");
const routes = require('./server/router');
const path = require('path');

const app = express();

app.use(cors());

app.use(express.json());
app.use('/', express.static(path.join(__dirname,'public')));
app.use(morgan("dev"));
app.use('/', routes);
app.use('/login_regist', routes);
app.use('/info', routes);


app.listen(config.host.port);