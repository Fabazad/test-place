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
