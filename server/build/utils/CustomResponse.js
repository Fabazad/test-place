const isFailedResponse = (response) => !response.success;
export function handleResponseForRoute(response, handlers) {
    if (isFailedResponse(response)) {
        const handler = handlers?.[response.errorCode];
        console.log(handler);
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
