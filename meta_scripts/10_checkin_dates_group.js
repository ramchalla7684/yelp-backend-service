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
        if (!document || !document.dates) {
            continue;
        }

        await groupDates(document.dates, document._id, db);
        console.log(i++);
    }

    console.log("DONE");
}


function groupDates(dates, docID, db) {

    let group = {};
    for (let date of dates) {
        let m = moment(date);
        let year = m.year();
        let month = m.month();

        //Quarter
        // let monthGroup = Math.floor(month / 3);
        let monthGroup = month;

        if (!group[year]) {
            group[year] = {};
        }
        if (!group[year][monthGroup]) {
            group[year][monthGroup] = 0;
        }

        group[year][monthGroup] += 1;
    }

    return new Promise((resolve, reject) => {
        db.collection('checkins').updateOne({
            _id: ObjectId(docID)
        }, {
            $set: {
                dates_group: group
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