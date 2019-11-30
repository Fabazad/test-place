var Crawler = require("crawler");

class ProductModel {

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
                        // $ is Cheerio by default
                        //a lean implementation of core jQuery designed specifically for the server

                        const livraisonText = $('div.olp-text-box span.a-color-base').text();
                        var livraisonPrice = 0;
                        if (!livraisonText.match(/GRATUITE/)) {
                            livraisonPrice = parseFloat(livraisonText.replace(/[^0-9]*([0-9]+,[0-9])+[^0-9]*/, "$1").replace(",", "."));
                        }
                        const price = parseFloat($('td.a-span12 span.a-size-medium.a-color-price').text().trim().replace(",", "."))


                        const res = {
                            title: $('h1.a-size-large').text().trim(),
                            price: price + livraisonPrice,
                            description: $('div.centerColAlign div.a-section.a-spacing-medium').text().trim().replace(/\s+/g, " "),
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
}

module.exports = ProductModel;