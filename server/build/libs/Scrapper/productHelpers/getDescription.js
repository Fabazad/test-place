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
