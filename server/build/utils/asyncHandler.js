
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="62cb6891-067c-561d-a3bf-85e90e5099f2")}catch(e){}}();
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
//# sourceMappingURL=asyncHandler.js.map
//# debugId=62cb6891-067c-561d-a3bf-85e90e5099f2
