import { CustomResponse } from "@/utils/CustomResponse.js";
import axios, { AxiosInstance } from "axios";

export const sendTransactionalEmail = async (params: {
  brevoAxios: AxiosInstance;
  from: { name?: string; email: string };
  to: { name?: string; email: string };
  subject: string;
  templateId: string;
  templateParams: Record<string, any>;
}): Promise<CustomResponse<string, "email_not_sent">> => {
  const { brevoAxios, from, to, subject, templateId, templateParams } = params;
  try {
    const res = await brevoAxios.post<{ messageId: string }>("/smtp/email", {
      subject,
      sender: from,
      to: [to],
      templateId,
      params: templateParams,
    });

    return { success: true, data: res.data.messageId };
  } catch (err: unknown) {
    if (axios.isAxiosError<{ code: string; message: string }>(err) && err.response) {
      const { code, message } = err.response.data;
      return {
        success: false,
        errorCode: "email_not_sent",
        errorMessage: `[${code}]: ${message}`,
      };
    }
    return {
      success: false,
      errorCode: "email_not_sent",
      errorMessage: err?.toString(),
    };
  }
};
