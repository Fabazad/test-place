export const createSingletonGetter = (createInstanceFunction) => {
    let instance;
    return () => {
        if (!instance) {
            instance = createInstanceFunction();
        }
        return instance;
    };
};
