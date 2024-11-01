import { Item } from "paapi5-typescript-sdk";

export const getTitle = (item: Item): string | undefined => {
  const title = item.ItemInfo?.Title?.DisplayValue;
  if (!title) return undefined;
  return title;
};
