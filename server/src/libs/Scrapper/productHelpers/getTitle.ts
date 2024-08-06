export const getTitle = ($: cheerio.Root): string | undefined => {
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
