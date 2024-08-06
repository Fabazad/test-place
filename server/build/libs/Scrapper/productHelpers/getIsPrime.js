export const getIsPrime = ($) => {
    const $prime = $(".prime-bbop-logo");
    console.log($prime.html(), $prime.length);
    return $prime.length > 0;
};
