
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="0b3a19e6-8885-5d63-bacb-8c02dccda730")}catch(e){}}();
export const getDescription = (item) => {
    if (!item.ItemInfo?.Features?.DisplayValues[0])
        return undefined;
    return item.ItemInfo.Features.DisplayValues.join("\n");
};
//# sourceMappingURL=getDescription.js.map
//# debugId=0b3a19e6-8885-5d63-bacb-8c02dccda730
