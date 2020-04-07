const {
    ObjectId
} = require('mongodb');
const mongodbClient = require('../configurations/mongodb-client');

mongodbClient.init((error, client) => {
    if (error) {
        console.error(error);
        return;
    }

    const db = mongodbClient.getDB();
    if (!db) {
        console.error("Not connected to mongodb");
        return;
    }

    db.collection('businesses').find({}).project({
        categories: 1
    }).forEach((document) => {
        if (!document || !document.categories) {
            return;
        }

        db.collection('businesses').updateOne({
            _id: ObjectId(document._id)
        }, {
            $set: {
                _categories: document.categories,
                categories: document.categories.split(", ")
            }
        }, (error, result) => {
            if (error) {
                console.error(error);
                return;
            }
        });
    }, (error) => {
        // console.error(error);
        if (error) {
            console.error(error);
            return;
        }
        console.log("DONE");
    });
});