export const getCategory = ($) => {
    const $category = $("#nav-subnav");
    if ($category.length) {
        const category = $category.attr("data-category");
        if (category)
            return category;
    }
    return undefined;
};
