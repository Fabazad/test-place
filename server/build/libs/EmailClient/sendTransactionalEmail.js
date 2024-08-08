import axios from "axios";
export const sendTransactionalEmail = async (params) => {
    const { brevoAxios, from, to, subject, templateId, templateParams } = params;
    try {
        const res = await brevoAxios.post("/smtp/email", {
            subject,
            sender: from,
            to: [to],
            templateId,
            params: templateParams,
        });
        return { success: true, data: res.data.messageId };
    }
    catch (err) {
        if (axios.isAxiosError(err) && err.response) {
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
