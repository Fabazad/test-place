const constants =  require("../helpers/constants");

var Crawler = require("crawler");
const ProductModel = require('../models/product.model');
const ErrorResponses =  require("../helpers/ErrorResponses");

class ProductController {

    static async scrapFromAsin(asin) {
        return new Promise((resolve, reject) => {

            var c = new Crawler({
                maxConnections : 10,
                userAgent: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/13.0.782.112 Safari/535.1",
                // This will be called for each crawled page
                callback : (error, res) => {
                    var $ = res.$;
                    if (error) {
                        reject({ status: 500, message: "Internal Server Error."});
                    }
                    else if(res.statusCode === 404){
                        reject({ status: 404, message: "Aucun produit trouvé."});
                    } else {
                        const livraisonText = $('div.olp-text-box span.a-color-base').text();
                        var livraisonPrice = 0;
                        if (!livraisonText.match(/GRATUITE/)) {
                            livraisonPrice = parseFloat(livraisonText.replace(/[^0-9]*([0-9]+,[0-9])+[^0-9]*/, "$1").replace(",", "."));
                        }
                        const price = parseFloat($('td.a-span12 span.a-size-medium.a-color-price').text().trim().replace(",", "."));

                        const description = $('div.centerColAlign div.a-section.a-spacing-medium').text().trim()
                            .replace(/\s{2,}/g, "\n\n") //Remove white spaces
                            .replace(/^[\s\S]*?\}\)\s*/gm, "") //Remove starting text
                            .replace(/Voir plus de détails$/, ""); // Remove ending text
                            

                        const res = {
                            title: $('h1.a-size-large').text().trim(),
                            price: price + livraisonPrice,
                            description: description,
                            imageSrc: $('#landingImage').attr("src").trim(),
                            isPrime: !!$('div#shippingMessageInsideBuyBox_feature_div.feature div.a-row').text().trim()
                        };
                        resolve(res);
                    }
                }
            });
            const url = `https://www.amazon.fr/dp/${asin}`;
            c.queue(url);
        });
    }

    static async create( productObj, userId ) {
        return new Promise((resolve, reject) => {
            productObj.sellerId = userId;
            const product = new ProductModel( productObj );
            product.save().then(resolve).catch(err => {
                if (err.code === 11000) {
                    reject({status: 400, message: 'Un produit avec le même identifiant ASIN existe déjà.'})
                }
                reject({status: 400, message: err.errmsg})
            });
        });
    }

    static async find( searchData ) {
        return new Promise((resolve, reject) => {
            ProductModel.find({}).then(resolve).catch(err => reject(ErrorResponses.mongoose(err)))
        });
    }

    static async getCategories(  ) {
        return new Promise((resolve, reject) => {
            const categories = constants.PRODUCT_CATEGORIES;
            if (categories && categories.length > 0 ) {
                resolve(categories);
            } else {
                reject({status: 500, message: 'Missing categories.'})
            }
        });
    }
}

module.exports = ProductController;