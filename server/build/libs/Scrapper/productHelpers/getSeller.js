
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="2d328a16-e312-5e8e-9dda-82e6d356067b")}catch(e){}}();
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
//# debugId=2d328a16-e312-5e8e-9dda-82e6d356067b
