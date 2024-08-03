import { PRODUCT_CATEGORIES_MAP } from "../productCategory.constants";

export const getCategory = ($: cheerio.CheerioAPI): string | undefined => {
  const $category = $('#searchDropdownBox option[selected="selected"]');
  if ($category.length) {
    const category = PRODUCT_CATEGORIES_MAP[$category.text().trim()];
    if (category) {
      return category;
    }
  }
  return undefined;
};
