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
            stars: 1,
            keywords: 1
        }).sort({
            _id: 1
        }).toArray();

        if (reviews.length == 0) {
            console.log(i);
            continue;
        }

        await groupKeywordsByStars(reviews, document._id, db);
        console.log(i + ' ' + 'GROUPED');
    }

    console.log("DONE");
}

function groupKeywordsByStars(reviews, docID, db) {

    let group = {};

    for (let review of reviews) {
        let m = moment(review.date);

        let year = m.year();
        let month = m.month();
        let quarter = Math.floor(month / 3);

        addToGroup(group, year, quarter, review.stars, review.keywords);
    }

    // aggregate(group);

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

function addToGroup(group, year, quarter, stars, keywords) {
    if (!group[year]) {
        group[year] = {};
    }

    if (!group[year][quarter]) {
        group[year][quarter] = {
            'stars': {},
            'keywords': {}
        };
    }

    if (!group[year][quarter]['stars'][stars]) {
        group[year][quarter]['stars'][stars] = {};
    }

    for (let keyword in keywords) {
        let sentimentScores = keywords[keyword];

        if (!group[year][quarter]['stars'][stars][keyword]) {
            group[year][quarter]['stars'][stars][keyword] = [];
        }

        if (!group[year][quarter]['keywords'][keyword]) {
            group[year][quarter]['keywords'][keyword] = [];
        }

        group[year][quarter]['stars'][stars][keyword] = group[year][quarter]['stars'][stars][keyword].concat(sentimentScores);
        group[year][quarter]['keywords'][keyword] = group[year][quarter]['keywords'][keyword].concat(sentimentScores);
    }
}

function aggregate(group) {

    for (let year in group) {
        for (let quarter in group[year]) {

            for (let stars in group[year][quarter]['stars']) {
                for (let keyword in group[year][quarter]['stars'][stars]) {
                    let len = Math.max(group[year][quarter]['stars'][stars][keyword].length, 1);
                    group[year][quarter]['stars'][stars][keyword] = {
                        sentiment_score: (group[year][quarter]['stars'][stars][keyword].reduce((a, b) => a + b, 0) / len).toFixed(4),
                        frequency: len
                    };
                }
            }

            for (let keyword in group[year][quarter]['keywords']) {
                let len = Math.max(group[year][quarter]['keywords'][keyword].length, 1);
                group[year][quarter]['keywords'][keyword] = {
                    sentiment_score: (group[year][quarter]['keywords'][keyword].reduce((a, b) => a + b, 0) / len).toFixed(4),
                    frequency: len
                };
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