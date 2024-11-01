
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="310a4d34-ec75-5de5-8d3f-88c4a631c52c")}catch(e){}}();
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
//# debugId=310a4d34-ec75-5de5-8d3f-88c4a631c52c
