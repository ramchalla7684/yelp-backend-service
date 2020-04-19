const {
    ObjectId
} = require('mongodb');
const moment = require('moment-timezone');
const mongodbClient = require('../configurations/mongodb-client');

async function start() {

    const db = mongodbClient.getDB();
    if (!db) {
        console.error("Not connected to mongodb");
        return;
    }

    let cursor = db.collection('checkins').find({});

    let i = 0;
    while (await cursor.hasNext()) {
        let document = await cursor.next();
        if (!document || !document.date) {
            continue;
        }

        let dates = document.date.split(", ").map(date => new Date(moment.tz(date, "UTC").format()));
        await modifyDate(dates, document._id, db);
        console.log(i++);
    }

    console.log("DONE");
}


function modifyDate(dates, docID, db) {
    return new Promise((resolve, reject) => {
        db.collection('checkins').updateOne({
            _id: ObjectId(docID)
        }, {
            $set: {
                dates: dates
            }
        }, (error, result) => {

            if (error) {
                console.error(error);
                reject(0);
                return;
            }

            resolve(1);
        });
    });
}

mongodbClient.init((error, client) => {
    if (error) {
        console.error(error);
        return;
    }
    start();
});