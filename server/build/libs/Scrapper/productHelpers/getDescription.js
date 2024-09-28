
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="21769bc9-49e7-599a-a16f-1bdee2ccbddd")}catch(e){}}();
export const getDescription = ($) => {
    const $description = $("#feature-bullets");
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
//# debugId=21769bc9-49e7-599a-a16f-1bdee2ccbddd
