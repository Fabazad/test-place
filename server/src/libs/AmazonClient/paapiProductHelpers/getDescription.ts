import { Item } from "paapi5-typescript-sdk";

export const getDescription = (item: Item): string | undefined => {
  if (!item.ItemInfo?.Features?.DisplayValues[0]) return undefined;
  return item.ItemInfo.Features.DisplayValues.join("\n");
};
