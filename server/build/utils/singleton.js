
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="e1362b36-c0bd-5dc4-9165-92c872e8b968")}catch(e){}}();
export const createSingletonGetter = (createInstanceFunction) => {
    let instance;
    return () => {
        if (!instance) {
            instance = createInstanceFunction();
        }
        return instance;
    };
};
//# sourceMappingURL=singleton.js.map
//# debugId=e1362b36-c0bd-5dc4-9165-92c872e8b968
