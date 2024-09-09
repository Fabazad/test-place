
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="ce76763f-582e-5223-bfdb-85634d0ae87c")}catch(e){}}();
export const getDescription = ($) => {
    const $description = $("#productFactsDesktop_feature_div");
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
//# debugId=ce76763f-582e-5223-bfdb-85634d0ae87c
