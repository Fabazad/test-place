export const getIsPrime = ($: cheerio.Root): boolean => {
  const $prime = $(".prime-bbop-logo");
  return $prime.length > 0;
};
