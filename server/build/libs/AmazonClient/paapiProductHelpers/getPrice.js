
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="ef87a278-84c1-5ab3-95c0-1945774d7ff5")}catch(e){}}();
import { getAmazonProductDetails } from "../scrapperProductHelpers/index.js";
export const getPrice = async (item, amazonMerchantId) => {
    if (amazonMerchantId) {
        const result = await getAmazonProductDetails({ asin: item.ASIN, amazonMerchantId });
        if (!result.success)
            return null;
        return {
            amount: result.data.price,
            isPrime: result.data.isPrime,
            seller: result.data.seller,
        };
    }
    if (!item.Offers?.Listings?.[0])
        return null;
    const merchantListing = item.Offers.Listings[0];
    if (!merchantListing || !merchantListing.Price?.Amount)
        return null;
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
//# sourceMappingURL=getPrice.js.map
//# debugId=ef87a278-84c1-5ab3-95c0-1945774d7ff5
