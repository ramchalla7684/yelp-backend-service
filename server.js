require('dotenv').config();
const http = require('http');
const app = require('./app');

http.createServer(app).listen(process.env.SERVER_PORT);

process.on('uncaughtException', (error) => {
    console.error("UNCAUGHT EXCEPTION", error);
});