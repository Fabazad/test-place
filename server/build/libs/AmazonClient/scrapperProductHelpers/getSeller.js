
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="b535cc9d-b7c5-54e4-9fce-89caffa0bfee")}catch(e){}}();
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
//# sourceMappingURL=getSeller.js.map
//# debugId=b535cc9d-b7c5-54e4-9fce-89caffa0bfee
