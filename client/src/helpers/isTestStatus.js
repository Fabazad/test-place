export const isTestStatus = ({ statusesToCheck, test }) => {
  if (typeof statusesToCheck === "string") {
    return statusesToCheck === test.status;
  }
  return statusesToCheck.includes(test.status);
};
