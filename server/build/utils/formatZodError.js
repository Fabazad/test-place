
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a5a347b4-1303-52f9-9a5e-47c1d7079f0f")}catch(e){}}();
export const formatZodError = (errors) => {
    return errors.issues.reduce((acc, key) => {
        return `${acc}\n${key.path.join(".")}: ${key.message}`;
    }, "");
};
//# sourceMappingURL=formatZodError.js.map
//# debugId=a5a347b4-1303-52f9-9a5e-47c1d7079f0f
