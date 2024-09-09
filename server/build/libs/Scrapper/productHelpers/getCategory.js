
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="8a3bf958-c2bf-588d-8de2-c83399f75692")}catch(e){}}();
export const getCategory = ($) => {
    const $category = $("#nav-subnav");
    if ($category.length) {
        const category = $category.attr("data-category");
        if (category)
            return category;
    }
    return undefined;
};
//# sourceMappingURL=getCategory.js.map
//# debugId=8a3bf958-c2bf-588d-8de2-c83399f75692
