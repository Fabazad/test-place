
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="12d0bac1-0d1b-5de5-a86b-c8850b367065")}catch(e){}}();
import axios from "axios";
export const sendTransactionalEmail = async (params) => {
    const { brevoAxios, from, to, templateId, templateParams } = params;
    try {
        const res = await brevoAxios.post("/smtp/email", {
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
//# sourceMappingURL=sendTransactionalEmail.js.map
//# debugId=12d0bac1-0d1b-5de5-a86b-c8850b367065
