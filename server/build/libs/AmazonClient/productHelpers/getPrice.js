
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="bf2c793e-7a40-5844-a37a-20ba74eb6595")}catch(e){}}();
export const getPrice = ($) => {
    const $price = $("#tp_price_block_total_price_ww>span");
    if ($price.length) {
        return parseFloat($price.text().replace("€", "").trim().replace(/,/, "."));
    }
    return 0;
};
//# sourceMappingURL=getPrice.js.map
//# debugId=bf2c793e-7a40-5844-a37a-20ba74eb6595
