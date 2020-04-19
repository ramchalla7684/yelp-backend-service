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
        i++;
        let document = await cursor.next();
        if (!document || !document.business_id) {
            continue;
        }

        let reviews = await db.collection('reviews_sub').find({
            business_id: document.business_id
        }).project({
            date: 1,
            keywords: 1
        }).sort({
            _id: 1
        }).toArray();

        if (reviews.length == 0) {
            console.log(i + ' ' + 'PASS');
            continue;
        }

        await groupKeywords(reviews, document._id, db);
        console.log(i);
    }

    console.log("DONE");
}

function groupKeywords(reviews, docID, db) {

    let group = {};

    for (let review of reviews) {
        let m = moment(review.date);

        let year = m.year();
        let month = m.month();
        let quarter = Math.floor(month / 3);

        addToGroup(group, year, quarter, review.keywords);
    }

    aggregate(group);

    return new Promise((resolve, reject) => {
        db.collection('businesses').updateOne({
            _id: ObjectId(docID)
        }, {
            $set: {
                keywords: group
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

function addToGroup(group, year, quarter, keywords) {
    if (!group[year]) {
        group[year] = {};
    }

    if (!group[year][quarter]) {
        group[year][quarter] = {};
    }

    for (let keyword in keywords) {
        let sentimentScore = keywords[keyword];
        if (!group[year][quarter][keyword]) {
            group[year][quarter][keyword] = [];
        }
        group[year][quarter][keyword].push(sentimentScore);
    }
}

function aggregate(group) {
    for (let year in group) {
        for (let quarter in group[year]) {
            for (let keyword in group[year][quarter]) {
                let len = Math.max(group[year][quarter][keyword].length, 1);
                group[year][quarter][keyword] = (group[year][quarter][keyword].reduce((a, b) => a + b, 0) / len).toFixed(4);
            }
        }
    }
}

mongodbClient.init((error, client) => {
    if (error) {
        console.error(error);
        return;
    }
    start();
});