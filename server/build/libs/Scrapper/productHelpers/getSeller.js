export const getSeller = ($) => {
    const $seller = $("a#sellerProfileTriggerId");
    if ($seller.length) {
        const hrefAttr = $seller.attr("href");
        if (!hrefAttr)
            return undefined;
        return {
            name: $seller.text().trim(),
            url: `https://amazon.fr${hrefAttr.trim()}`,
        };
    }
    return undefined;
};
