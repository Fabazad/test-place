export const isTestStatus = ({statusesToCheck, statuses, test}) => {
    if (typeof statusesToCheck === "string") {
        return statuses[statusesToCheck] === test.status;
    }
    return statusesToCheck.some(status => statuses[status] === test.status);
};