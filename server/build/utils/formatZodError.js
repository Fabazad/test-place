export const formatZodError = (errors) => {
    return errors.issues.reduce((acc, key) => {
        return `${acc}\n${key.path.join(".")}: ${key.message}`;
    }, "");
};
