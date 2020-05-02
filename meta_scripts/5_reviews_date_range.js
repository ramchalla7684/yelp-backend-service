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

    let cursor = db.collection('reviews').aggregate([{
        $group: {
            _id: '$business_id',
            start_date: {
                $min: '$date'
            },
            end_date: {
                $max: '$date'
            }
        }
    }]);

    let i = 0;
    while (await cursor.hasNext()) {
        let document = await cursor.next();
        if (!document || !document._id) {
            continue;
        }
        await addDataRange(document._id, document.start_date, document.end_date, db);
        i++;
        console.log(i);
    }
    console.log("DONE");
});

function addDataRange(business_id, start_date, end_date, db) {
    return new Promise((resolve, reject) => {
        db.collection('businesses').updateOne({
            business_id: business_id
        }, {
            $set: {
                reviews_start_date: start_date,
                reviews_end_date: end_date
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