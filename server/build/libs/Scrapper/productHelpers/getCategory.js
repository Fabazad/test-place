
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="9ced3334-19be-553c-ab90-4665d96a4115")}catch(e){}}();
export const getCategory = ($) => {
    const $category = $("#nav-subnav");
    if ($category.length) {
        const category = $category.attr("data-category");
        console.log({ category });
        if (category)
            return category;
    }
    return undefined;
};
//# sourceMappingURL=getCategory.js.map
//# debugId=9ced3334-19be-553c-ab90-4665d96a4115
