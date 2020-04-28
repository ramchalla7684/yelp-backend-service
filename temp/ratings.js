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

    let cursor = db.collection('businesses').find({});

    let i = 0;
    while (await cursor.hasNext()) {
        let document = await cursor.next();
        if (!document || !document.business_id) {
            continue;
        }

        let reviews = await db.collection('reviews').find({
            business_id: document.business_id
        }).project({
            date: 1,
            stars: 1
        }).sort({
            _id: 1
        }).toArray();

        await groupRatings(reviews, document._id, db);

        // console.log(reviews.length);
        console.log(i++);
    }

    console.log("DONE");
}

function groupRatings(reviews, docID, db) {

    let group = {};

    for (let review of reviews) {
        let year = moment(review.date).year();
        let month = moment(review.date).month();

        let date = moment(review.date).utc().format('ll');
        addToGroup(group, date, year, month, review.stars);
    }

    return new Promise((resolve, reject) => {
        db.collection('businesses').updateOne({
            _id: ObjectId(docID)
        }, {
            $set: {
                ratings: group
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

function addToGroup(group, date, year, month, stars) {
    if (!group[year]) {
        group[year] = {};
    }

    if (!group[year][month]) {
        group[year][month] = {
            stars: {}
        };
    }

    if (!group[year][month].stars[stars]) {
        group[year][month].stars[stars] = 0;
    }

    group[year][month].stars[stars] += 1;
}

mongodbClient.init((error, client) => {
    if (error) {
        console.error(error);
        return;
    }
    start();
});