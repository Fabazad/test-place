export const getPrice = ($: cheerio.Root): number => {
  const $price = $("#tp_price_block_total_price_ww>span");
  if ($price.length) {
    return parseFloat($price.text().replace("€", "").trim().replace(/,/, "."));
  }
  return 0;
};
