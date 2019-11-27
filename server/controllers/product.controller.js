const rp = require('request-promise');
const $ = require('cheerio');

class ProductModel {

    static async scrapFromAsin(asin) {
        return new Promise((resolve, reject) => {
            const url = `https://www.amazon.fr/dp/${asin}`;
            rp(url)
                .then(function(html){
                    console.log($('tr#priceblock_saleprice_row td.a-span12', html).html());
                    const res = {
                        title: $('h1.a-size-large', html).text().trim(),
                        price: parseFloat($('td.a-span12 span.a-size-medium.a-color-price', html).text().trim().replace(",", ".")),
                        description: $('div.centerColAlign div.a-section.a-spacing-medium', html).text().trim(),
                        imageSrc: $('#landingImage', html).attr("src").trim(),
                        //isPrime: $.find('div.a-column span.feature span.feature').length > 0
                    };
                    resolve(res);
                })
                .catch(function(err){
                    reject({ status: 400, message: "Aucun produit trouvé."});
                });
        });
    }
}

module.exports = ProductModel;