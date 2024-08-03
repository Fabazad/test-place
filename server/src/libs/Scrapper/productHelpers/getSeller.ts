export const getSeller = (
  $: cheerio.CheerioAPI
): { name: string; url: string } | undefined => {
  const $seller = $("a#sellerProfileTriggerId");
  if ($seller.length) {
    const hrefAttr = $seller.attr("href");
    if (!hrefAttr) return undefined;
    return {
      name: $seller.text().trim(),
      url: `"https://amazon.fr${hrefAttr.trim()}`,
    };
  }
  return undefined;
};
