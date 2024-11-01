
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="8d825d2f-f447-5c8f-9061-3c809c775c68")}catch(e){}}();
export const getTitle = (item) => {
    const title = item.ItemInfo?.Title?.DisplayValue;
    if (!title)
        return undefined;
    return title;
};
//# sourceMappingURL=getTitle.js.map
//# debugId=8d825d2f-f447-5c8f-9061-3c809c775c68
