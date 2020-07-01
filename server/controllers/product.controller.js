const constants = require("../helpers/constants");
const Crawler = require("crawler");
const ProductModel = require('../models/product.model');
const ErrorResponses = require("../helpers/ErrorResponses");
const {ROLES, VALID_TEST_STATUSES} = constants;
const ObjectId = require('mongoose').Types.ObjectId;


class ProductController {
    static async scrapFromAsin(asin) {
        return new Promise(async (resolve, reject) => {
            const product = await ProductModel.findOne({asin});
            if (product) {
                return reject({status: 400, message: "Un produit avec ce même ASIN a déjà été ajouté."});
            }

            const url = `https://www.amazon.fr/dp/${asin}`;

            const maxTest = 2;
            let currentTest = 1;

            let c = new Crawler({
                maxConnections: 10,
                // This will be called for each crawled page
                callback: (error, res) => {
                    let $ = res.$;
                    if (error) {
                        reject({status: 500, message: "Internal Server Error."});
                    } else if (res.statusCode === 404) {
                        reject({status: 404, message: "Aucun produit trouvé."});
                    } else {
                        const scrapRes = {
                            title: undefined,
                            price: 0,
                            description: undefined,
                            isPrime: false,
                            category: undefined,
                            seller: undefined,
                            imageUrls: []
                        };

                        //Images
                        const $images = $('.a-button-thumbnail img');
                        if ($images.length) {
                            $images.each(i => {
                                const url = $($('.a-button-thumbnail img')[i]).attr('src');
                                const match = url.match(/I\/(.+)\._AC/);
                                if (match) {
                                    scrapRes.imageUrls.push('https://images-na.ssl-images-amazon.com/images/I/' + match[1] + '.jpg');
                                }
                            });
                            if (!scrapRes.imageUrls.length) {
                                const url = `https://www.amazon.fr/dp/${asin}`;
                                c.queue(url);
                                return;
                            }
                        }

                        //Title
                        const $title = $('#comparison_title .a-size-base.a-color-base:not(.a-text-bold)');
                        if ($title.length) {
                            scrapRes.title = $title.text().trim();
                        } else {
                            const $titleMeta = $('meta[name=title]');
                            if ($titleMeta.length) {
                                scrapRes.title = $titleMeta.attr("content");
                            }
                        }

                        //Price
                        const $livraison = $('div.olp-text-box span.a-color-base');
                        if ($livraison.length && !$livraison.text().match(/GRATUITE/)) {
                            scrapRes.price += parseFloat($livraison.text().replace(/[^0-9]*([0-9]+,[0-9])+[^0-9]*/, "$1").replace(",", "."));
                        }
                        const $price = $('#cerberus-data-metrics');
                        if ($price.length) {
                            scrapRes.price += parseFloat($price.attr("data-asin-price").trim().replace(/,/, '.'));
                        }

                        //Description
                        const $description = $('div.centerColAlign div.a-section.a-spacing-medium');
                        if ($description.length) {
                            scrapRes.description = $description.text().trim()
                                .replace(/\s{2,}/g, "\n\n") //Remove white spaces
                                .replace(/^[\s\S]*?\}\)\s*/gm, "") //Remove starting text
                                .replace(/Voir plus de détails$/, ""); // Remove ending text
                        }

                        //Prime
                        const $prime = $('div#shippingMessageInsideBuyBox_feature_div.feature div.a-row');
                        if ($prime.length) {
                            scrapRes.isPrime = !!$prime.text().trim()
                        }

                        //Category
                        const $category = $('#searchDropdownBox option[selected="selected"]');
                        if ($category.length) {
                            const category = constants.PRODUCT_CATEGORIES.find(c => c.text === $category.text().trim());
                            if (category) {
                                scrapRes.category = category.value;
                            }
                        }

                        //Seller
                        const $seller = $('a#sellerProfileTriggerId');
                        if ($seller.length) {
                            scrapRes.seller = {
                                name: $seller.text().trim(),
                                url: 'https://amazon.fr' + $seller.attr('href').trim()
                            };
                        }

                        if (!scrapRes.description && currentTest < maxTest) {
                            currentTest++;
                            c.queue(url)
                        } else {
                            resolve(scrapRes);
                        }
                    }
                }
            });

            c.queue(url);
        });
    }

    static async create(productObj, userId) {
        return new Promise((resolve, reject) => {
            productObj.seller = userId;
            const product = new ProductModel(productObj);
            product.publishDate = new Date();
            product.publishExpirationDate = (new Date()).setMonth((new Date()).getMonth() + 1);
            product.save().then(resolve).catch(err => {
                if (err.code === 11000) {
                    reject({status: 400, message: 'Un produit avec le même asin a déjà été publié.'});
                }
                reject(ErrorResponses.mongoose(err));
            });
        });
    }

    static async find(decoded, searchData) {
        return new Promise((resolve, reject) => {
            const {category, keyWords, minPrice, maxPrice, free, automaticAcceptance, prime, itemsPerPage, page, sortBy, published, remainingRequests, seller} = searchData;

            const pipeline = [];
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
                query.automaticAcceptance = true;
            }
            if (prime) {
                query.isPrime = true;
            }
            pipeline.push({
                $lookup: {
                    from: "tests",
                    as: "tests",
                    let: { productId: "$_id" },
                    pipeline: [{
                        $match: {
                            $expr: { $eq: ["$product._id", "$$productId"] },
                            $or: [{
                                expirationDate: { $gt: new Date() }
                            }, {
                                expirationDate: { $eq: null }
                            }],
                            status: { $in: VALID_TEST_STATUSES }
                        }
                    }]
                }
            });
            pipeline.push({
                $addFields: {
                    testsCount: { $cond: { if: { $isArray: "$tests" }, then: { $size: "$tests" }, else: 0} }
                }
            });

            if (remainingRequests) {
                pipeline.push({
                    $match: {
                        $expr: { "$lt": ["$testsCount", "$maxDemands"] }
                    }
                });
            }
            if (seller) {
                query.seller = ObjectId(seller);
            }

            let sort;
            switch (sortBy) {
                case 'createdAt':
                default:
                    sort = {createdAt: -1};
                    break;
                case 'score':
                    if (keyWords) {
                        sort = {score: {$meta: "textScore"}};
                    } else {
                        sort = {createdAt: -1};
                    }
                    break;
                case 'price':
                case 'finalPrice':
                    sort = {[sortBy]: 1};
                    break;
            }

            if (published === undefined && decoded && decoded.userId) {
                // No published field and user logged case : user can see its product and the published ones
                query.$or = [
                    { publishExpirationDate: {$gte: new Date()} },
                    { seller: ObjectId(decoded.userId) }
                ];
            } else if (published !== undefined) {
                // Publish field case
                query.publishExpirationDate = published ? {$gte: new Date()} : undefined;
                if (!decoded || !decoded.userId) {
                    // If no logged user then only the published ones
                    query.publishExpirationDate = {$gte: new Date()};
                } else if (published === false) {
                    //No published products and connected user case : user need to be the seller
                    query.seller = ObjectId(decoded.userId);
                }
            }

            pipeline.unshift({ $match: query });

            const aggregate = ProductModel.aggregate(pipeline);
            ProductModel.aggregatePaginate(aggregate, {page, limit: itemsPerPage, sort})
                .then(res => resolve({hits: res.docs, totalCount: res.totalDocs}))
                .catch(err => reject(ErrorResponses.mongoose(err)));
        });
    }

    static async getCategories() {
        return new Promise((resolve, reject) => {
            const categories = constants.PRODUCT_CATEGORIES;
            if (categories && categories.length > 0) {
                resolve(categories);
            } else {
                reject({status: 500, message: 'Missing categories.'})
            }
        });
    }

    static async getOne(productId, userId) {
        return new Promise((resolve, reject) => {
            if (!ObjectId.isValid(productId)) {
                return reject({status: 400, message: 'Not a product id'});
            }
            ProductModel.findById(productId).populate('seller')
                .then(product => {
                    if (product) resolve(product);
                    else return reject({status: 404, message: 'Couldn\'t find product'});
                })
                .catch(err => reject(ErrorResponses.mongoose(err)));
        });
    }

    static async update(productId, fields, user) {
        return new Promise((resolve, reject) => {

            ProductModel.findById(productId)
                .then(product => {
                    if (product.seller.toString() !== user.userId && !user.roles.includes(ROLES.ADMIN)) {
                        return reject({status: 400, message: 'You\'re not the seller of this product.'})
                    }

                    if (fields.published || fields.publishExpirationDate) {
                        fields.publishExpirationDate = (new Date()).setMonth((new Date()).getMonth() + 1);
                        delete fields.published;
                    }
                    if (fields.published === false) {
                        fields.publishExpirationDate = null;
                        delete fields.published;
                    }

                    ProductModel.findByIdAndUpdate(productId, fields)
                        .then(resolve)
                        .catch(err => reject(ErrorResponses.mongoose(err)));
                }).catch(err => reject(ErrorResponses.mongoose(err)));
        });
    }

    static async delete(productId, userId) {
        return new Promise(async (resolve, reject) => {

            const product = await ProductModel.findById(productId);

            if (!product) {
                return reject({status: 400, message: "Wrong product id"});
            }

            if (product.seller.toString() !== userId) {
                return reject({status: 401, message: "Unauthorized"});
            }

            ProductModel.findByIdAndDelete(productId)
                .then(resolve)
                .catch(err => reject(ErrorResponses.mongoose(err)));
        });
    }
}

module.exports = ProductController;


