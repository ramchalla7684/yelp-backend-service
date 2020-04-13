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

    let i = 0;
    // Not efficient
    while (await cursor.hasNext()) {
        let document = await cursor.next();
        if (!document || !document.category) {
            continue;
        }
        await saveReviews(document, db);
        console.log(i++);
    }
    console.log("DONE");
}

function saveReviews(document, db) {

    let top = 15;
    return new Promise(async (resolve, reject) => {
        let cursor = db.collection('businesses').find({
            categories: document.category
        }).project({
            business_id: 1,
            review_count: 1
        }).sort({
            review_count: -1
        }).limit(top);

        while (await cursor.hasNext()) {
            let document = await cursor.next();
            if (!document || !document.business_id) {
                continue;
            }
            await insertReviews(document, db);
        }

        resolve(1);
    });
}

function insertReviews(document, db) {
    return new Promise((resolve, reject) => {
        db.collection('reviews').find({
            business_id: document.business_id
        }).toArray(async (error, documents) => {
            if (error) {
                console.error(error);
                reject(-1);
                return;
            }

            for (let document of documents) {
                delete document._id;

                if (await db.collection('reviews_sub_2').find({
                        review_id: document.review_id
                    }).limit(1).hasNext()) {
                    // console.log("Exists");
                    continue;
                }
                await insertOne(document, db);
            }
            resolve(1);

        });
    });
}

function insertOne(document, db) {
    return new Promise((resolve, reject) => {
        db.collection('reviews_sub_2').insertOne(document, (error, result) => {
            if (error) {
                console.error(error);
                reject(-1);
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