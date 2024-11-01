
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="4c52689a-2385-5ec9-8680-c7fc5cd6bea0")}catch(e){}}();
export const getPrice = ($) => {
    const $price = $("#tp_price_block_total_price_ww>span");
    if ($price.length) {
        return parseFloat($price.text().replace("€", "").trim().replace(/,/, "."));
    }
    return 0;
};
//# sourceMappingURL=getPrice.js.map
//# debugId=4c52689a-2385-5ec9-8680-c7fc5cd6bea0
