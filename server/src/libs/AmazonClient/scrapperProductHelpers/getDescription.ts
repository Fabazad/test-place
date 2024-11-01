export const getDescription = ($: cheerio.Root): string | undefined => {
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
