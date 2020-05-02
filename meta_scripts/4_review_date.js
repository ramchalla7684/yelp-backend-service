const {
    ObjectId
} = require('mongodb');
const moment = require('moment-timezone');
const mongodbClient = require('../configurations/mongodb-client');

mongodbClient.init(async (error, client) => {
    if (error) {
        console.error(error);
        return;
    }

    const db = mongodbClient.getDB();
    if (!db) {
        console.error("Not connected to mongodb");
        return;
    }

    let cursor = db.collection('reviews').find({}).project({
        date: 1
    });

    let i = 0;
    while (await cursor.hasNext()) {
        let document = await cursor.next();
        if (!document || !document.date) {
            continue;
        }
        await modifyDate(document.date, document._id, db);
        i++;
        if (i % 10000 === 0) {
            console.log(i);
        }
    }
    console.log("DONE");
});

function modifyDate(date, docID, db) {
    return new Promise((resolve, reject) => {
        db.collection('reviews').updateOne({
            _id: ObjectId(docID)
        }, {
            $set: {
                _date: date,
                date: new Date(moment.tz(date, "UTC").format())
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