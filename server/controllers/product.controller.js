const constants = require("../helpers/constants");

const Crawler = require("crawler");
const ProductModel = require('../models/product.model');
const ErrorResponses = require("../helpers/ErrorResponses");

class ProductController {

    static async scrapFromAsin(asin) {
        return new Promise((resolve, reject) => {

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
                        const $title = $('h1.a-size-large');
                        if ($title.length) {
                            scrapRes.title = $title.text().trim();
                        }

                        //Price
                        const $livraison = $('div.olp-text-box span.a-color-base');
                        if ($livraison.length && !$livraison.text().match(/GRATUITE/)) {
                            scrapRes.price += parseFloat($livraison.text().replace(/[^0-9]*([0-9]+,[0-9])+[^0-9]*/, "$1").replace(",", "."));
                        }
                        const $price = $('td.a-span12 span.a-size-medium');
                        if ($price.length) {
                            scrapRes.price += parseFloat($price.text().slice(0, -1).trim().replace(/,/, '.'));
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

                        resolve(scrapRes);
                    }
                }
            });
            const url = `https://www.amazon.fr/dp/${asin}`;
            c.queue(url);
        });
    }

    static async create(productObj, userId) {
        return new Promise((resolve, reject) => {
            productObj.seller = userId;
            const product = new ProductModel(productObj);
            product.publishDate = new Date();
            product.publishExpirationDate = (new Date()).setMonth((new Date()).getMonth() + 1);
            product.remainingRequests = product.maxDemands;
            product.save().then(resolve).catch(err => {
                if (err.code === 11000) {
                    reject({status: 400, message: 'Vous avez déjà fait une demande de test pour ce produit.'});
                }
                reject(ErrorResponses.mongoose(err));
            });
        });
    }

    static async find(decoded, searchData) {
        return new Promise((resolve, reject) => {
            const {category, keyWords, minPrice, maxPrice, free, automaticAcceptance, prime, itemsPerPage, page, sortBy, published, remainingRequests} = searchData;

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
            if (remainingRequests) {
                query.remainingRequests = { $gt: 0 };
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
                    { publishExpirationDate: { $gte: new Date() } },
                    {seller: decoded.userId}
                ];
            } else if (published !== undefined) {
                // Publish field case
                query.publishExpirationDate = published ? { $gte: new Date() } : undefined;
                if (!decoded || !decoded.userId) {
                    // If no logged user then only the published ones
                    query.publishExpirationDate = { $gte: new Date() };
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
            ProductModel.findById(productId).populate('seller')
                .then(product => {
                    const published = Date.now() <= product.publishExpirationDate.getTime();
                    if (!published && product.seller._id.toString() !== userId) {
                        return reject({status: 401, message: "Unauthorize"});
                    }
                    return resolve(product);
                })
                .catch(err => reject(ErrorResponses.mongoose(err)));
        });
    }

    static async update(productId, fields, userId) {
        return new Promise((resolve, reject) => {
            ProductModel.findById(productId)
                .then(product => {
                    if (fields.published || fields.publishExpirationDate) {
                        fields.publishExpirationDate = (new Date()).setMonth((new Date()).getMonth() + 1);
                        delete fields.published;
                    }
                    if (fields.published === false) {
                        fields.publishExpirationDate = null;
                        delete fields.published;
                    }
                    if (!product.updateAuth(userId, fields, null)) {
                        return reject({status: 401, message: "Unauthorized"});
                    }
                    ProductModel.findByIdAndUpdate(productId, fields)
                        .then(resolve)
                        .catch(err => reject(ErrorResponses.mongoose(err)));
                }).catch(err => reject(ErrorResponses.mongoose(err)));
        });
    }

    static async delete(productId, userId) {
        return new Promise((resolve, reject) => {
            ProductModel.findById(productId)
                .then(product => {
                    if (!product) {
                        return reject({ status: 400, message: "Wrong product id"});
                    }
                    if (product.seller.toString() !== userId) {
                        return reject({ status: 401, message: "Unauthorized"});
                    }
                    ProductModel.findByIdAndDelete(productId)
                        .then(resolve)
                        .catch(err => reject(ErrorResponses.mongoose(err)));
                }).catch(err => reject(ErrorResponses.mongoose(err)));
        });
    }
}

module.exports = ProductController;


