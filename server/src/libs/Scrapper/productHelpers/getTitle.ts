export const getTitle = ($: cheerio.CheerioAPI): string | undefined => {
  const $title = $("#comparison_title .a-size-base.a-color-base:not(.a-text-bold)");
  if ($title.length) {
    return $title.text().trim();
  }
  const $titleMeta = $("meta[name=title]");
  if ($titleMeta.length) {
    return $titleMeta.attr("content");
  }
  return undefined;
};
