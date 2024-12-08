
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="2b427fa4-df20-5df9-bd4c-1bd92debd766")}catch(e){}}();
import { configs } from "../configs.js";
import { getProductDAO } from "../entities/Product/dao/product.dao.index.js";
import { isProductCategory, } from "../entities/Product/product.constants.js";
import { PRODUCT_CATEGORIES, } from "../entities/Product/product.entity.js";
import { getUserDAO } from "../entities/User/dao/user.dao.index.js";
import { getAmazonClient } from "../libs/AmazonClient/index.js";
import { getEmailClient } from "../libs/EmailClient/index.js";
import { getEventProducer } from "../libs/EventProducer/index.js";
import { getMonitoringClient } from "../libs/MonitoringClient/index.js";
import { Role } from "../utils/constants.js";
import dayjs from "dayjs";
export class ProductController {
    static async scrapFromAsin(params) {
        const { asin, amazonMerchantId } = params;
        const productDAO = getProductDAO();
        const amazonClient = getAmazonClient();
        const product = await productDAO.getProductByAsin({ asin });
        if (product)
            return {
                success: false,
                errorCode: "already_product_with_asin",
                errorMessage: product._id,
            };
        const scrappedData = await amazonClient.getAmazonProductDetails({
            asin,
            amazonMerchantId,
        });
        if (!scrappedData.success)
            return scrappedData;
        const category = scrappedData.data.category;
        if (category) {
            if (isProductCategory(category)) {
                return { success: true, data: { ...scrappedData.data, category } };
            }
        }
        const { category: _, ...dataWithoutCategory } = scrappedData.data;
        return { success: true, data: dataWithoutCategory };
    }
    static async create(params) {
        const { productData, userId } = params;
        const productDAO = getProductDAO();
        const userDAO = getUserDAO();
        const eventProducer = getEventProducer();
        const monitoringClient = getMonitoringClient();
        const user = await userDAO.getUser({ userId });
        if (!user)
            return { success: false, errorCode: "user_not_found" };
        const creationRes = await productDAO.create({
            productData: {
                ...productData,
                seller: userId,
                publishDate: new Date(),
                publishExpirationDate: dayjs()
                    .add(configs.PUBLICATION_TIME_IN_DAYS, "d")
                    .toDate(),
                remainingTestsCount: productData.maxDemands,
                isFromCertifiedSeller: user.isCertified,
            },
        });
        if (!creationRes.success)
            return creationRes;
        const newProduct = creationRes.data;
        const res = await eventProducer.sendProductPublished(newProduct);
        if (!res.success)
            await monitoringClient.sendEvent({
                eventName: "send_product_published_error",
                data: {
                    productId: newProduct._id,
                    error: `[${res.errorCode}] ${res.errorMessage}`,
                },
                level: "error",
            });
        return { success: true, data: creationRes.data };
    }
    static async findPageResults(params) {
        const { searchData } = params;
        const productDAO = getProductDAO();
        const queryRes = await productDAO.findPageResults({ searchData });
        return { success: true, data: queryRes };
    }
    static async getCategories() {
        const categories = PRODUCT_CATEGORIES;
        if (categories && categories.length > 0) {
            return { success: true, data: Array.from(categories) };
        }
        return { success: false, errorCode: "missing_categories" };
    }
    static async getOne(params) {
        const { productId } = params;
        const productDAO = getProductDAO();
        const product = await productDAO.getPopulatedProductById({ id: productId });
        if (!product)
            return { success: false, errorCode: "not_found" };
        return { success: true, data: product };
    }
    static async update(params) {
        const { productId, published, fields, user: { userId, roles }, } = params;
        const productDAO = getProductDAO();
        const product = await productDAO.getProductById({ id: productId });
        if (!product)
            return { success: false, errorCode: "not_found" };
        if (product.seller !== userId && !roles.includes(Role.ADMIN)) {
            return { success: false, errorCode: "not_allowed" };
        }
        const publishExpirationDate = published === true || (published === undefined && product.publishExpirationDate)
            ? dayjs().add(configs.PUBLICATION_TIME_IN_DAYS, "d").toDate()
            : null;
        const newProduct = await productDAO.updateProduct({
            id: productId,
            // @ts-ignore
            updates: {
                publishExpirationDate,
                ...(fields ? fields : {}),
            },
        });
        if (!newProduct)
            return { success: false, errorCode: "not_found_when_updating" };
        return { success: true, data: newProduct };
    }
    static async delete(params) {
        const { productId, userId } = params;
        const productDAO = getProductDAO();
        const product = await productDAO.getProductById({ id: productId });
        if (!product)
            return { success: false, errorCode: "not_found" };
        if (product.seller !== userId) {
            return { success: false, errorCode: "not_allowed" };
        }
        const oldProduct = await productDAO.findAndDeleteProduct({ id: productId });
        if (oldProduct === null)
            return { success: false, errorCode: "not_found_when_deleting" };
        return { success: true, data: oldProduct };
    }
    static async emailLastPublishedProducts(params) {
        const { frontendUrl, lastPublishedProductsPeriodInDays, productsLimit } = params;
        const productDAO = getProductDAO();
        const emailClient = getEmailClient();
        const userDAO = getUserDAO();
        const fromDate = dayjs().subtract(lastPublishedProductsPeriodInDays, "d").toDate();
        const [{ hits: products, totalCount: productsCount }, testers] = await Promise.all([
            productDAO.findLastPublishedProducts({ fromDate, limit: productsLimit }),
            userDAO.getTestersContacts(),
        ]);
        const emailsRes = await emailClient.sendLastPublishedProductsMail({
            frontendUrl,
            products,
            productsCount,
            to: testers,
        });
        return { success: true, data: emailsRes.data };
    }
}
//# sourceMappingURL=product.controller.js.map
//# debugId=2b427fa4-df20-5df9-bd4c-1bd92debd766
