const {
    ObjectId
} = require('mongodb');
const moment = require('moment-timezone');
const mongodbClient = require('../configurations/mongodb-client');

async function start() {

    let top = 15;
    const db = mongodbClient.getDB();
    if (!db) {
        console.error("Not connected to mongodb");
        return;
    }

    let cursor = db.collection('business_categories').find({}).project({
        category: 1,
        count: 1
    }).sort({
        count: -1
    }).limit(top);

    while (await cursor.hasNext()) {
        let document = await cursor.next();
        if (!document || !document.category) {
            continue;
        }

        let _cursor = db.collection('businesses').find({
            categories: document.category
        }).project({
            business_id: 1,
            review_count: 1
        }).sort({
            review_count: -1
        }).limit(top);


        while (await _cursor.hasNext()) {
            let document = await _cursor.next();
            if (!document || !document.business_id) {
                continue;
            }

            let checkins = await db.collection('checkins').find({
                business_id: document.business_id
            }).toArray();

            if (checkins.length == 0) {
                continue;
            }

            let dates_group = checkins[0].dates_group;
            console.log(dates_group);
        }
    }
    console.log("DONE");
}

mongodbClient.init((error, client) => {
    if (error) {
        console.error(error);
        return;
    }
    start();
});