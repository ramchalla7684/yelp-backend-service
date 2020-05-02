const {
    ObjectId
} = require('mongodb');
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

    let cursor = db.collection('businesses').find({}).project({
        business_id: 1
    });

    let i = 0;
    while (await cursor.hasNext()) {
        let document = await cursor.next();
        if (!document || !document.business_id) {
            continue;
        }
        await addReviewCount(document.business_id, document._id, db);
        console.log(i++);
    }
    console.log("DONE");
});

function addReviewCount(business_id, docID, db) {
    return new Promise((resolve, reject) => {
        db.collection('reviews').find({
            business_id: business_id
        }).count((error, count) => {
            if (error) {
                console.error(error);
                reject(0);
                return;
            }

            db.collection('businesses').updateOne({
                _id: ObjectId(docID)
            }, {
                $set: {
                    review_count: count
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

    });
}