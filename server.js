const express = require('express');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// add cors support for local development
app.use(cors({
    origin: ['http://localhost:4200',
        'https://mycarnegie.carnegiescience.edu',
        'https://dev-people.carnegiescience.edu',]
}));

// use helmet for security
app.use(helmet());

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to the backend of Gas Cylinder Order System V1."});
});

// Require orders routes
require('./app/routes/order.routes.js')(app);

https.createServer({
    key: fs.readFileSync('/etc/pki/tls/digicert/star_carnegiescience_edu.key'),
    cert: fs.readFileSync('/etc/pki/tls/digicert/star_carnegiescience_edu.pem')
}, app).listen(3000, () => {
    console.log("Server is listening on port 3000");
});
