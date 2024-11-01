
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="5aa2166d-1ab4-521a-8f78-25a1b2e72e76")}catch(e){}}();
export const getIsPrime = (item) => {
    return item.Offers?.Listings?.[0]?.ProgramEligibility?.IsPrimeExclusive || false;
};
//# sourceMappingURL=getIsPrime.js.map
//# debugId=5aa2166d-1ab4-521a-8f78-25a1b2e72e76
