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

    let categories = new Set();
    db.collection('businesses').find({}).project({
        categories: 1
    }).forEach((document) => {
        if (!document || !document.categories) {
            return;
        }

        for (let category of document.categories) {
            categories.add(category);
        }
    }, (error) => {
        if (error) {
            console.error(error);
            return;
        }
        console.log(categories.size);
        saveCategories(Array.from(categories), db);
    });
});

async function saveCategories(categories, db) {

    for (let category of categories) {
        await insertOneCategory(category, db);
    }
    console.log("DONE");
}

function insertOneCategory(category, db) {
    return new Promise((resolve, reject) => {

        db.collection('businesses').find({
            categories: category
        }).count((error, count) => {
            if (error) {
                console.error(error);
                reject(0);
                return;
            }

            db.collection('business_categories').insertOne({
                category,
                count
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