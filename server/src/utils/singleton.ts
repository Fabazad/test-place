export const createSingletonGetter = <ReturnType>(
  createInstanceFunction: () => ReturnType
) => {
  let instance: ReturnType;
  return () => {
    if (!instance) {
      instance = createInstanceFunction();
    }
    return instance;
  };
};
