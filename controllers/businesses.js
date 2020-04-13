const mongodbClient = require('../configurations/mongodb-client');
module.exports.getMostReviewedBusinesses = (request, response, next) => {
    let category = request.query.category;
    let top = Number(request.query.top) || 15;
    top = Math.max(Math.min(top, 15), 1);

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
        review_count: 1,
        reviews_start_date: 1,
        reviews_end_date: 1
    }).sort({
        review_count: -1
    }).limit(top).toArray((error, documents) => {
        if (error) {
            console.error(error);
            response.status(500).json({});
            return;
        }

        documents = documents.map(document => {
            delete document._id;
            return document;
        });
        response.status(200).json(documents);
    });
}