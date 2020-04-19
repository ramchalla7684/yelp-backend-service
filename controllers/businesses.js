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

module.exports.getBusinessDetails = (request, response, next) => {
    let business_id = request.params.business_id;

    const db = mongodbClient.getDB();
    if (!db) {
        console.error("Not connected to mongodb");
        response.status(500).json({});
        return;
    }

    db.collection('businesses').findOne({
        business_id: business_id
    }, (error, document) => {
        if (error) {
            console.error(error);
            response.status(500).json({});
            return;
        }

        if (!document) {
            response.status(400).json({
                message: "Invalid business ID"
            });
            return;
        }

        let availableDates = {};
        for (let year in document.ratings) {
            availableDates[year] = Object.keys(document.ratings[year]).sort();
        }

        let startYear = Math.min(...Object.keys(availableDates));
        delete availableDates[startYear];

        let ratings = {};
        for (let year in availableDates) {
            ratings[year] = {};
            for (let quarter in availableDates[year]) {
                ratings[year][quarter] = [];

                let monthly = [];
                for (let month in document.ratings[year][quarter].monthly) {
                    monthly.push({
                        date: `${document.ratings[year][quarter].monthly[month].month} 01, ${year}`,
                        stars: document.ratings[year][quarter].monthly[month].stars,
                    });
                }

                let weekly = [];
                for (let week in document.ratings[year][quarter].weekly) {
                    weekly.push({
                        date: document.ratings[year][quarter].weekly[week].start,
                        stars: document.ratings[year][quarter].weekly[week].stars
                    });
                }

                let daily = [];
                for (let day in document.ratings[year][quarter].daily) {
                    daily.push({
                        date: document.ratings[year][quarter].daily[day].date,
                        stars: document.ratings[year][quarter].daily[day].stars
                    });
                }

                ratings[year][quarter] = [{
                    name: 'monthly',
                    data: monthly
                }, {
                    name: 'weekly',
                    data: weekly
                }, {
                    name: 'daily',
                    data: daily
                }, ];
            }
        }

        response.status(200).json({
            business_id: document.business_id,
            name: document.name,
            latitude: document.latitude,
            longitude: document.longitude,
            categories: document.categories,
            review_count: document.review_count,
            available_dates: availableDates,
            ratings: ratings
        });

    });
}