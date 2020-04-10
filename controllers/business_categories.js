const mongodbClient = require('../configurations/mongodb-client');

module.exports.getTopBusinessCategories = (request, response, next) => {
    let top = Number(request.query.top) || 20;

    const db = mongodbClient.getDB();
    if (!db) {
        console.error("Not connected to mongodb");
        response.status(500).json({});
        return;
    }

    db.collection('business_categories').find({}).project({
        category: 1,
        count: 1
    }).sort({
        count: -1
    }).limit(top).toArray((error, documents) => {
        if (error) {
            console.error(error);
            response.status(500).json({});
            return;
        }

        documents = documents.map(document => {
            return {
                category: document.category,
                count: document.count
            };
        });
        response.status(200).json(documents);
    });
}