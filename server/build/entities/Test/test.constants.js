
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="b7b45627-f788-59cc-a233-193a5d799686")}catch(e){}}();
export const TestStatus = {
    REQUESTED: "REQUESTED",
    REQUEST_CANCELLED: "REQUEST_CANCELLED",
    REQUEST_DECLINED: "REQUEST_DECLINED",
    REQUEST_ACCEPTED: "REQUEST_ACCEPTED",
    PRODUCT_ORDERED: "PRODUCT_ORDERED",
    PRODUCT_RECEIVED: "PRODUCT_RECEIVED",
    PRODUCT_REVIEWED: "PRODUCT_REVIEWED",
    REVIEW_VALIDATED: "REVIEW_VALIDATED",
    REVIEW_REFUSED: "REVIEW_REFUSED",
    MONEY_SENT: "MONEY_SENT",
    MONEY_RECEIVED: "MONEY_RECEIVED",
    TEST_CANCELLED: "TEST_CANCELLED",
};
export const GLOBAL_TEST_STATUSES = {
    REQUESTED: [TestStatus.REQUESTED],
    PROCESSING: [
        TestStatus.REQUEST_ACCEPTED,
        TestStatus.PRODUCT_ORDERED,
        TestStatus.PRODUCT_RECEIVED,
        TestStatus.PRODUCT_REVIEWED,
        TestStatus.REVIEW_VALIDATED,
        TestStatus.MONEY_SENT,
    ],
    COMPLETED: [TestStatus.MONEY_RECEIVED],
    CANCELLED: [
        TestStatus.REVIEW_REFUSED,
        TestStatus.TEST_CANCELLED,
        TestStatus.REQUEST_CANCELLED,
    ],
};
//# sourceMappingURL=test.constants.js.map
//# debugId=b7b45627-f788-59cc-a233-193a5d799686
