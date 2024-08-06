export const getNativEnumData = (zodNativeEnum) => {
    const values = Object.values(zodNativeEnum.values);
    const isString = typeof values[values.length - 1] === "string";
    const type = isString ? String : Number;
    const elements = isString ? values : values.filter((e) => typeof e === "number");
    return { type, elements };
};
