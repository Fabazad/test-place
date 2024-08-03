export const getPrice = ($: cheerio.CheerioAPI): number => {
  const $livraison = $("div.olp-text-box span.a-color-base");
  let price = 0;
  if ($livraison.length && !$livraison.text().match(/GRATUITE/)) {
    price += parseFloat(
      $livraison
        .text()
        .replace(/[^0-9]*([0-9]+,[0-9])+[^0-9]*/, "$1")
        .replace(",", ".")
    );
  }
  const $price = $("#cerberus-data-metrics");
  if ($price.length) {
    const $priceElem = $price.attr("data-asin-price");
    if ($priceElem) {
      price += parseFloat($priceElem.trim().replace(/,/, "."));
    }
  }
  return price;
};
