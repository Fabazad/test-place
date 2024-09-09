
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a534ed13-2846-5d5d-ad73-19fb1d3314d5")}catch(e){}}();
export const getPrice = ($) => {
    const $price = $("#tp_price_block_total_price_ww>span");
    if ($price.length) {
        return parseFloat($price.text().replace("€", "").trim().replace(/,/, "."));
    }
    return 0;
};
//# sourceMappingURL=getPrice.js.map
//# debugId=a534ed13-2846-5d5d-ad73-19fb1d3314d5
