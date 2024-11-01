import { Item } from "paapi5-typescript-sdk";

export const getIsPrime = (item: Item): boolean => {
  return item.Offers?.Listings?.[0]?.ProgramEligibility?.IsPrimeExclusive || false;
};
