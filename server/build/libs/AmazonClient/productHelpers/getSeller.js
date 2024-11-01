
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="d15e2784-c0c1-5461-8acd-926d4b017253")}catch(e){}}();
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
//# debugId=d15e2784-c0c1-5461-8acd-926d4b017253
