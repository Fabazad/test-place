
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="2b8b96cf-7c42-5d6c-9553-36e094f1a461")}catch(e){}}();
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
//# debugId=2b8b96cf-7c42-5d6c-9553-36e094f1a461
