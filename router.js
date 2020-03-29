const reviewsRouter = require('./routes/reviews');

function init(app) {

    app.use((request, response, next) => {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (request.method === 'OPTIONS') {
            response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
            return response.status(200).json({});
        }

        next();
    });

    app.use('/api/v1/reviews', reviewsRouter);

    app.use((request, response, next) => {
        let error = new Error("Not Found");
        error.status = 404;
        error.custom = true;

        next(error);
    });

    app.use((error, request, response, next) => {

        console.error(error.message);

        if (error.custom) {
            response.status(error.status || 500).json({
                error: {
                    message: error.message
                }
            });
        } else {
            response.status(error.status || 500).json({
                error: {
                    message: 'Unable to handle the request'
                }
            });
        }
    });

    return app;

}

module.exports = {
    init
};