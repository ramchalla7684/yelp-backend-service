## Yelp Business Insights

> Public dataset: [https://www.yelp.com/dataset](http://yelpdashboard.s3.amazonaws.com/index.html)


#### prerequisities:
* NodeJS
* MongoDB

<br>

If you want to setup it up locally, download the project and run
```
npm install
```

<br>

Download the yelp dataset.

Install MongoDB and import the yelp dataset into it with the collection names same as the .json file names.

<br>
Then run the scripts in the `meta_scripts` folder in the same order, to extract some meta information and change the data model suited for this project.

```
node meta_scripts/1_save_business_categories.js
```

You can skip the above step and download the .json files [business_categories.json](https://yelpasucse578data.s3.amazonaws.com/business_categories.json), [businesses.json](https://yelpasucse578data.s3.amazonaws.com/businesses.json), [checkins.json](https://yelpasucse578data.s3.amazonaws.com/checkins.json), [reviews_sub.json](https://yelpasucse578data.s3.amazonaws.com/reviews_sub.json)

_These files will be hosted with public access until May 21 2020 for the purpose of an academic project under the course CSE578 at Arizona State University_

[Original dataset: [https://www.yelp.com/dataset](https://www.yelp.com/dataset)]


<br>

Create a `.env` file the project folder and write
```
APP_NAME = yelp_backend_service

MONGODB_DATABASE_NAME = <mongodb_databse_name>
MONGODB_CONNECTION_URI = <your_mongodb_connection_url>

SERVER_PORT = 3100
```

<br>

Start the server with 
```
npm start
```

*Server will be running at port 3100*