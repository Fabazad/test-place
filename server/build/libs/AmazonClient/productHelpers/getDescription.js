
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="3b47c7d5-ee4f-5ab1-bbc8-ac6269dcc773")}catch(e){}}();
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
//# debugId=3b47c7d5-ee4f-5ab1-bbc8-ac6269dcc773
