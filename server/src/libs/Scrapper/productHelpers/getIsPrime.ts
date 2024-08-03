export const getIsPrime = ($: cheerio.CheerioAPI): boolean => {
  const $prime = $("div#shippingMessageInsideBuyBox_feature_div.feature div.a-row");
  if ($prime.length) {
    return !!$prime.text().trim();
  }
  return false;
};
