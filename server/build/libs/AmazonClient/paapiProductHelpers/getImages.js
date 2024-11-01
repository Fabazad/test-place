
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a9559640-b4e3-5c23-aca0-36180dd94c52")}catch(e){}}();
export const getImages = (item) => {
    const primaryUrls = item.Images?.Primary?.Large?.URL
        ? [item.Images.Primary.Large.URL]
        : [];
    const variants = item.Images?.Variants;
    const variantsUrls = variants
        ? variants.map((v) => v?.Large?.URL).filter((u) => typeof u === "string")
        : [];
    return [...primaryUrls, ...variantsUrls];
};
//# sourceMappingURL=getImages.js.map
//# debugId=a9559640-b4e3-5c23-aca0-36180dd94c52
