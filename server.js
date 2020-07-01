/**
 * server.js : main file where execution starts.
 */
const m = require('./utils/mongo.util');
const express = require('express');
const nocache = require('nocache');
const body_parser = require('body-parser');
const cors = require('cors');
const http = require('http');
const passport = require('passport');
const config = require('./configurations/config');
const routes = require('./webServer/routes');

const app = express();
const host_name = config.host_name;
const port = config.http_port;

require('./configurations/passport')(passport);
app.use(passport.initialize());
app.use(nocache());
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());
app.use(cors());
routes.navigateRoutes(app);

const http_server = http.createServer(app);

http_server.listen(port, host_name);
app.listen(port, () => console.info(`Server listning on port : ${port} with host name : ${host_name}`));
