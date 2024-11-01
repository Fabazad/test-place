
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="7a4cdb32-d464-53d2-91e1-b788d709102c")}catch(e){}}();
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
//# debugId=7a4cdb32-d464-53d2-91e1-b788d709102c
