const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongodb = require('./configurations/mongodb-client');

const app = express();

console.log("Server Started");

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

router.init(app);
mongodb.init((error, database) => {
    if (error) {
        console.error(error);
    } else {
        console.log("Connected to MongoDB");
    }
});