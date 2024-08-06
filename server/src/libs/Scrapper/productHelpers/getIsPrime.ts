export const getIsPrime = ($: cheerio.Root): boolean => {
  const $prime = $(".prime-bbop-logo");
  console.log($prime.html(), $prime.length);
  return $prime.length > 0;
};
