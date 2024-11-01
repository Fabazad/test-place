
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="da77d2dc-91e4-568e-8889-2b74a84c909f")}catch(e){}}();
import { configs } from "../../../configs.js";
import { getMonitoringClient } from "../../MonitoringClient/index.js";
import { GetItemsRequest, Host, PartnerType, Region } from "paapi5-typescript-sdk";
import { getDescription } from "./getDescription.js";
import { getImages } from "./getImages.js";
import { getPrice } from "./getPrice.js";
import { getTitle } from "./getTitle.js";
export const getAmazonProductDetails = async ({ asin, amazonMerchantId, }) => {
    const monitoringClient = getMonitoringClient();
    const request = new GetItemsRequest({
        ItemIdType: "ASIN",
        ItemIds: [asin],
        Resources: [
            "Images.Primary.Large",
            "ItemInfo.Title",
            "ItemInfo.Features",
            "ItemInfo.Classifications",
            "Offers.Listings.MerchantInfo",
            "Offers.Listings.ProgramEligibility.IsPrimeExclusive",
            "Offers.Listings.Price",
            // @ts-ignore
            "Images.Variants.Large",
        ],
    }, configs.AMAZON_AFFILIATION_TAG, PartnerType.ASSOCIATES, configs.AMAZON_ACCESS_KEY, configs.AMAZON_SECRET_KEY, Host.FRANCE, Region.FRANCE);
    const data = await request.send();
    if (data.Errors?.length || 0 > 0) {
        return {
            success: false,
            errorCode: "unknown_error",
            errorMessage: data.Errors.map((e) => e.Message).join(", "),
        };
    }
    if (data.ItemsResult.Items.length === 0)
        return { success: false, errorCode: "product_not_found" };
    const item = data.ItemsResult.Items[0];
    const priceResult = await getPrice(item, amazonMerchantId);
    if (priceResult === null) {
        await monitoringClient.sendEvent({
            level: "error",
            eventName: "could_not_find_price_for_amazon_product",
            data: { params: { asin, amazonMerchantId }, amazonResult: data },
        });
        return { success: false, errorCode: "missing_data" };
    }
    return {
        success: true,
        data: {
            title: getTitle(item),
            price: priceResult.amount,
            isPrime: priceResult.isPrime,
            description: getDescription(item),
            imageUrls: getImages(item),
            seller: priceResult.seller,
        },
    };
};
//# sourceMappingURL=index.js.map
//# debugId=da77d2dc-91e4-568e-8889-2b74a84c909f
