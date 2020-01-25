const constants = require("../helpers/constants");

const Crawler = require("crawler");
const TestModel = require('../models/test.model');
const ProductModel = require('../models/product.model');
const ErrorResponses = require("../helpers/ErrorResponses");

class TestController {

    static async create(testData, userId) {
        return new Promise((resolve, reject) => {
            const product = new ProductModel(testData.product);
            if (!product) {
                return reject({status: 400, message: "Couldn't find product."});
            }
            if (product.remainingRequests < 1) {
                return reject({status: 400, message: "Not enough remaining requests on this product."})
            }
            testData.tester = userId;
            testData.seller = product.seller;
            testData.status = constants.TEST_STATUSES.requested;
            testData.createdAt = new Date();
            testData.updates = [{date: new Date(), status: constants.TEST_STATUSES.requested}];
            const test = new TestModel(testData);

            test.save()
                .then(res => {
                    product.remainingRequests--;
                    product.save()
                        .then(() => resolve(test))
                        .catch(err => ErrorResponses.mongoose(err))
                })
                .catch(err => {
                    if (err.code === 11000) {
                        reject({status: 400, message: 'Un produit avec le même identifiant ASIN existe déjà.'});
                    }
                    reject(ErrorResponses.mongoose(err));
                });
        });
    }

    static async find(decoded, searchData) {
        return new Promise((resolve, reject) => {
            const {category, keyWords, minPrice, maxPrice, free, automaticAcceptance, prime, itemsPerPage, page, sortBy, published} = searchData;

            const query = {};
            if (category && category !== 'undefined' && category !== 'null') {
                query.category = category;
            }
            if (keyWords) {
                query.$text = {'$search': keyWords.toLowerCase()};
            }
            if (minPrice !== '' && minPrice !== undefined || maxPrice !== '' && maxPrice !== undefined) {
                query.price = {};
                if (minPrice) {
                    query.price.$gte = minPrice;
                }
                if (maxPrice) {
                    query.price.$lte = maxPrice;
                }
            }
            if (free) {
                query.finalPrice = '0';
            }
            if (automaticAcceptance) {
                query.automaticAcceptance = true
            }
            if (prime) {
                query.isPrime = true
            }

            const score = {score: {'$meta': "textScore"}};

            let sort;
            switch (sortBy) {
                default:
                case 'score':
                    sort = {score: {$meta: "textScore"}};
                    break;
                case 'price':
                case 'finalPrice':
                case 'createdAt':
                    sort = {[sortBy]: 1};
                    break;
            }

            if (published === undefined && decoded && decoded.userId) {
                // No published field and user logged case : user can see its product and the published ones
                query.$or = [
                    {publishExpirationDate: {$gte: new Date()}},
                    {seller: decoded.userId}
                ];
            } else if (published !== undefined) {
                // Publish field case
                query.publishExpirationDate = published ? {$gte: new Date()} : undefined;
                if (!decoded || !decoded.userId) {
                    // If no logged user then only the published ones
                    query.publishExpirationDate = {$gte: new Date()};
                } else if (published === false) {
                    //No published products and connected user case : user need to be the seller
                    query.seller = decoded.userId;
                }
            }

            ProductModel.find(query, score).sort(sort).skip(itemsPerPage * (page - 1)).limit(itemsPerPage)
                .then(res => {
                    ProductModel.count(query).then(count => {
                        resolve({hits: res, totalCount: count});
                    }).catch(err => reject(ErrorResponses.mongoose(err)))

                }).catch(err => reject(ErrorResponses.mongoose(err)))
        });
    }
}

module.exports = TestController;


