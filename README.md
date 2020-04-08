## Endpoints

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

#### GET /api/v1/businesses?category=Restaurants
#### Response
``` json
[
    {
        "business_id": "4JNXUYY8wbaaDmk3BPzlWw",
        "name": "Mon Ami Gabi",
        "latitude": 36.112859,
        "longitude": -115.172434,
        "categories": [
            "Food",
            "French",
            "Breakfast & Brunch",
            "Restaurants",
            "Steakhouses"
        ],
        "review_count": 8570
    },
    {
        "business_id": "RESDUcs7fIiihp38-d6_6g",
        "name": "Bacchanal Buffet",
        "latitude": 36.116113,
        "longitude": -115.176222,
        "categories": [
            "Restaurants",
            "Buffets",
            "Sandwiches",
            "Food",
            "Breakfast & Brunch"
        ],
        "review_count": 8568
    },
    ...
    ...
    {
        "business_id": "iCQpiavjjPzJ5_3gPD5Ebg",
        "name": "Secret Pizza",
        "latitude": 36.109837,
        "longitude": -115.174212,
        "categories": [
            "Pizza",
            "Restaurants"
        ],
        "review_count": 4351
    },
    {
        "business_id": "ujHiaprwCQ5ewziu0Vi9rw",
        "name": "The Buffet at Bellagio",
        "latitude": 36.11322,
        "longitude": -115.17689,
        "categories": [
            "American (New)",
            "Buffets",
            "Restaurants"
        ],
        "review_count": 4318
    }
]
```