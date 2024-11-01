
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="098ec960-69d3-571d-960d-5581ce542022")}catch(e){}}();
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
//# debugId=098ec960-69d3-571d-960d-5581ce542022
