## Endpoints
---
#### GET /api/v1/business_categories?top=10
#### Response
``` json
[
    {
        "category": "Restaurants",
        "count": 59371
    },
    {
        "category": "Shopping",
        "count": 31878
    },
    ...
    ...
    {
        "category": "Nightlife",
        "count": 13095
    },
    {
        "category": "Bars",
        "count": 11341
    }
]
```
---
#### GET /api/v1/businesses?category=Restaurants&top=10
#### Response
``` json
[
    {
        "business_id": "4JNXUYY8wbaaDmk3BPzlWw",
        "name": "Mon Ami Gabi",
        "latitude": 36.112859,
        "longitude": -115.172434,
        "review_count": 8570,
        "categories": [
            "Food",
            "French",
            "Breakfast & Brunch",
            "Restaurants",
            "Steakhouses"
        ],
        "reviews_end_date": "2018-11-14T00:50:10.000Z",
        "reviews_start_date": "2005-10-10T20:01:53.000Z"
    },
    {
        "business_id": "RESDUcs7fIiihp38-d6_6g",
        "name": "Bacchanal Buffet",
        "latitude": 36.116113,
        "longitude": -115.176222,
        "review_count": 8568,
        "categories": [
            "Restaurants",
            "Buffets",
            "Sandwiches",
            "Food",
            "Breakfast & Brunch"
        ],
        "reviews_end_date": "2018-11-14T17:58:20.000Z",
        "reviews_start_date": "2012-09-10T20:03:19.000Z"
    },
    ...
    ...
    {
        "business_id": "iCQpiavjjPzJ5_3gPD5Ebg",
        "name": "Secret Pizza",
        "latitude": 36.109837,
        "longitude": -115.174212,
        "review_count": 4351,
        "categories": [
            "Pizza",
            "Restaurants"
        ],
        "reviews_end_date": "2018-11-14T08:09:49.000Z",
        "reviews_start_date": "2010-12-20T08:31:37.000Z"
    },
    {
        "business_id": "ujHiaprwCQ5ewziu0Vi9rw",
        "name": "The Buffet at Bellagio",
        "latitude": 36.11322,
        "longitude": -115.17689,
        "review_count": 4318,
        "categories": [
            "American (New)",
            "Buffets",
            "Restaurants"
        ],
        "reviews_end_date": "2018-11-14T05:55:18.000Z",
        "reviews_start_date": "2005-11-26T06:52:29.000Z"
    }
]
```
---
#### GET /api/v1/businesses/4JNXUYY8wbaaDmk3BPzlWw
#### Response
*Sample response in samples/business.json*