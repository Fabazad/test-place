
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="3a0d6479-b59d-50dd-b992-3f1a792ab7c8")}catch(e){}}();
export const getDescription = ($) => {
    let $description = $("#feature-bullets");
    if (!$description.length) {
        $description = $(".a-expander-content.a-expander-partial-collapse-content");
    }
    if ($description.length) {
        return $description
            .text()
            .trim()
            .replace(/\s{2,}/g, "\n\n") //Remove white spaces
            .replace(/^[\s\S]*?\}\)\s*/gm, "") //Remove starting text
            .replace(/Voir plus de détails$/, ""); // Remove ending text
    }
    return undefined;
};
//# sourceMappingURL=getDescription.js.map
//# debugId=3a0d6479-b59d-50dd-b992-3f1a792ab7c8
