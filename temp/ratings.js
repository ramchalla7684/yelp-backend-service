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
        let m = moment(review.date);

        let year = m.year();
        let month = m.month();
        let week = m.day('Monday').week();

        let weekStartDate = moment(review.date).year(year).day('Monday').week(week).utc().format('LL');
        let weekEndDate = moment(review.date).year(year).day('Monday').week(week).add(6, 'day').utc().format('LL');

        if (moment(weekEndDate, 'LL').year() != year) {
            weekEndDate = `December 31, ${year}`;
        }
        let quarter = Math.floor(month / 3);

        addToGroup(group, moment(review.date).utc().format('LL'), year, quarter, week, weekStartDate, weekEndDate, review.stars);
    }

    aggregate(group);

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

function addToGroup(group, date, year, quarter, week, weekStartDate, weekEndDate, stars) {
    if (!group[year]) {
        group[year] = {};
    }

    if (!group[year][quarter]) {
        group[year][quarter] = {
            'weekly': {},
            'daily': {}
        };
    }

    if (!group[year][quarter]['weekly'][week]) {
        group[year][quarter]['weekly'][week] = {
            'start': weekStartDate,
            'end': weekEndDate,
            'stars': []
        };
    }

    if (!group[year][quarter]['daily'][date]) {
        group[year][quarter]['daily'][date] = {
            stars: []
        };
    }

    group[year][quarter]['weekly'][week].stars.push(stars);
    group[year][quarter]['daily'][date].stars.push(stars);
}

function aggregate(group) {
    for (let year in group) {
        for (let quarter in group[year]) {
            for (let week in group[year][quarter]['weekly']) {
                let len = Math.max(group[year][quarter]['weekly'][week].stars.length, 1);
                group[year][quarter]['weekly'][week].stars = (group[year][quarter]['weekly'][week].stars.reduce((a, b) => a + b, 0) / len).toFixed(4);
            }
            for (let date in group[year][quarter]['daily']) {
                let len = Math.max(group[year][quarter]['daily'][date].stars.length, 1);
                group[year][quarter]['daily'][date].stars = (group[year][quarter]['daily'][date].stars.reduce((a, b) => a + b, 0) / len).toFixed(4);
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