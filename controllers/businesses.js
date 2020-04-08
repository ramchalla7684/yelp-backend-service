const mongodbClient = require('../configurations/mongodb-client');
module.exports.getMostReviewedBusinesses = (request, response, next) => {
    let category = request.query.category;
    let top = 10;

    const db = mongodbClient.getDB();
    if (!db) {
        console.error("Not connected to mongodb");
        response.status(500).json({});
        return;
    }

    db.collection('businesses').find({
        categories: category
    }).project({
        business_id: 1,
        name: 1,
        latitude: 1,
        longitude: 1,
        categories: 1,
        review_count: 1
    }).sort({
        review_count: -1
    }).limit(top).toArray((error, documents) => {
        if (error) {
            console.error(error);
            response.status(500).json({});
            return;
        }

        documents = documents.map(document => {
            return {
                business_id: document.business_id,
                name: document.name,
                latitude: document.latitude,
                longitude: document.longitude,
                categories: document.categories,
                review_count: document.review_count
            };
        });
        response.status(200).json(documents);
    })
}