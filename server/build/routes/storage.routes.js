
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="8653b8cd-d57a-56f7-93a0-b61f06135550")}catch(e){}}();
import { StorageController } from "../controllers/storage.controller.js";
import { handleResponseForRoute } from "../utils/CustomResponse.js";
import { zodValidationForRoute } from "../utils/zodValidationForRoute.js";
import express from "express";
import { z } from "zod";
const router = express.Router();
router.post("/upload-url", async (request, reply) => {
    const { fileName, fileType } = zodValidationForRoute(request.body, z.object({ fileName: z.string(), fileType: z.string() }));
    const res = await StorageController.generateUploadUrl({ fileName, fileType });
    reply.send(handleResponseForRoute(res));
});
export default router;
//# sourceMappingURL=storage.routes.js.map
//# debugId=8653b8cd-d57a-56f7-93a0-b61f06135550
