
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="29b61afc-71a5-56b2-95e2-c6d334914a63")}catch(e){}}();
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
//# sourceMappingURL=getTitle.js.map
//# debugId=29b61afc-71a5-56b2-95e2-c6d334914a63
