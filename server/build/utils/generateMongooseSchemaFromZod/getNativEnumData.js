
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="3030f7c8-7264-57fe-a9ce-71883f8eb7bf")}catch(e){}}();
export const getNativEnumData = (zodNativeEnum) => {
    const values = Object.values(zodNativeEnum.values);
    const isString = typeof values[values.length - 1] === "string";
    const type = isString ? String : Number;
    const elements = isString ? values : values.filter((e) => typeof e === "number");
    return { type, elements };
};
//# sourceMappingURL=getNativEnumData.js.map
//# debugId=3030f7c8-7264-57fe-a9ce-71883f8eb7bf
