
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="d474cd33-1fd8-5889-823d-aa187d772d47")}catch(e){}}();
import { getProductDAO } from "../entities/Product/dao/product.dao.index.js";
import { getUserDAO } from "../entities/User/dao/user.dao.index.js";
import { getEventProducer } from "../libs/EventProducer/index.js";
import { getDatabaseConnection } from "../databaseConnection/index.js";
const sendRetroProductPublished = async () => {
    const databaseConnection = getDatabaseConnection();
    await databaseConnection.connect();
    getUserDAO();
    const productDAO = getProductDAO();
    const eventProducer = getEventProducer();
    let page = 1;
    while (true) {
        console.log("Start sending", page);
        const { hits: products } = await productDAO.findPageResults({
            searchData: { page, itemsPerPage: 50, sortBy: "createdAt" },
        });
        for (const product of products) {
            const res = await eventProducer.sendProductPublished(product);
            const title = product.title.slice(0, 50);
            if (!res.success) {
                console.error(title, res.errorCode, res.errorMessage);
            }
            else {
                console.log(title, "Success sending product published");
            }
        }
        if (products.length < 50)
            break;
        page++;
    }
    await databaseConnection.disconnect();
};
sendRetroProductPublished();
//# sourceMappingURL=sendRetroProductPublished.js.map
//# debugId=d474cd33-1fd8-5889-823d-aa187d772d47
