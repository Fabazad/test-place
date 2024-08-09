import { StorageController } from "@/controllers/storage.controller.js";
import { handleResponseForRoute } from "@/utils/CustomResponse.js";
import { zodValidationForRoute } from "@/utils/zodValidationForRoute.js";
import express from "express";
import { z } from "zod";

const router = express.Router();

router.post("/upload-url", async (request, reply) => {
  const { fileName, fileType } = zodValidationForRoute(
    request.body,
    z.object({ fileName: z.string(), fileType: z.string() })
  );

  const res = await StorageController.generateUploadUrl({ fileName, fileType });

  reply.send(handleResponseForRoute(res));
});

export default router;
