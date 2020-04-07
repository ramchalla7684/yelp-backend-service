require('dotenv').config();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let clientInstance;

function init(callback) {
    if (clientInstance) {
        callback(null, clientInstance);
    } else {
        MongoClient.connect(process.env.MONGODB_CONNECTION_URI, {
            poolSize: 5,
            appname: process.env.APP_NAME,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (error, client) => {
            if (error) {
                console.error(error);
                callback(error);
            } else {
                clientInstance = client;
                callback(null, clientInstance);
            }
        });
    }
}

function getDB() {
    if (!clientInstance) {
        return;
    }
    return clientInstance.db(process.env.MONGODB_DATABASE_NAME);
}

function getClient() {
    return clientInstance;
}

module.exports = {
    init,
    getDB,
    getClient
}