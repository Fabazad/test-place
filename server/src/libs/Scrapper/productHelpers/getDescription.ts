export const getDescription = ($: cheerio.CheerioAPI): string | undefined => {
  const $description = $("div.centerColAlign div.a-section.a-spacing-medium");
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
