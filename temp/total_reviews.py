from pymongo import MongoClient

mongoClient = MongoClient(port=27017)
db = mongoClient.yelp

n_business_categories = 15

cursor = db.business_categories.find({}, {'category': 1, 'count': 1}).sort({'count': -1}).limit(n_business_categories)
