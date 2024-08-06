export const getTitle = ($) => {
    const $title = $("#productTitle");
    if ($title.length) {
        return $title.text().trim();
    }
    const $titleMeta = $("meta[name=title]");
    if ($titleMeta.length) {
        return $titleMeta.attr("content");
    }
    return undefined;
};
