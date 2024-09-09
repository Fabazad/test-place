
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="b366390a-aeef-536f-8c2a-e03a845291e1")}catch(e){}}();
const isFailedResponse = (response) => !response.success;
export function handleResponseForRoute(response, handlers) {
    if (isFailedResponse(response)) {
        const handler = handlers?.[response.errorCode];
        throw typeof handler === "function" ? handler(response) : handler;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return "data" in response ? response.data : undefined;
}
export const formatFailedResponse = (response, map) => {
    const newError = map[response.errorCode];
    return { success: false, errorCode: newError, errorMessage: response.errorMessage };
};
//# sourceMappingURL=CustomResponse.js.map
//# debugId=b366390a-aeef-536f-8c2a-e03a845291e1
