
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="10915e52-b347-5833-b7af-dd4ac88a785b")}catch(e){}}();
export const round = (num, decimals) => {
    const factor = 10 ** decimals;
    return Math.round(num * factor) / factor;
};
//# sourceMappingURL=round.js.map
//# debugId=10915e52-b347-5833-b7af-dd4ac88a785b
