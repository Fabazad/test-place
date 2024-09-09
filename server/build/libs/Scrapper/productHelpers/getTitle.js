
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c1f22160-c78c-58dd-a0de-7b588efc407d")}catch(e){}}();
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
//# debugId=c1f22160-c78c-58dd-a0de-7b588efc407d
