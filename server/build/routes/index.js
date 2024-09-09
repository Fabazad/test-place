
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="b185ae34-402a-5758-9df0-77f23fd776f9")}catch(e){}}();
import { Router } from "express";
import frontRoutes from "./front.routes.js";
import notificationRoutes from "./notification.routes.js";
import productRoutes from "./product.routes.js";
import storageRoutes from "./storage.routes.js";
import testRoutes from "./test.routes.js";
import userRoutes from "./user.routes.js";
const router = Router();
router.use("/api/user", userRoutes);
router.use("/api/product", productRoutes);
router.use("/api/test", testRoutes);
router.use("/api/notification", notificationRoutes);
router.use("/api/storage", storageRoutes);
router.use("/", frontRoutes);
export default router;
//# sourceMappingURL=index.js.map
//# debugId=b185ae34-402a-5758-9df0-77f23fd776f9
