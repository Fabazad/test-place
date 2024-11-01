import { Item } from "paapi5-typescript-sdk";
import { getAmazonProductDetails } from "../scrapperProductHelpers/index.js";

export const getPrice = async (
  item: Item,
  amazonMerchantId?: string
): Promise<{
  amount: number;
  isPrime: boolean;
  seller?: { name: string; url: string };
} | null> => {
  if (amazonMerchantId) {
    const result = await getAmazonProductDetails({ asin: item.ASIN, amazonMerchantId });
    if (!result.success) return null;
    return {
      amount: result.data.price,
      isPrime: result.data.isPrime,
      seller: result.data.seller,
    };
  }

  if (!item.Offers?.Listings?.[0]) return null;

  const merchantListing = item.Offers.Listings[0];

  if (!merchantListing || !merchantListing.Price?.Amount) return null;

  const seller = merchantListing.MerchantInfo
    ? {
        name: merchantListing.MerchantInfo.Name,
        url: `https://www.amazon.fr/sp?ie=UTF8&seller=${merchantListing.MerchantInfo.Id}`,
      }
    : undefined;

  return {
    amount: merchantListing.Price.Amount,
    isPrime: merchantListing.ProgramEligibility?.IsPrimeExclusive || false,
    seller,
  };
};
