export const getImages = ($: cheerio.Root): Array<string> => {
  const $images = $(".a-button-thumbnail img");
  const images: Array<string> = [];
  if ($images.length) {
    $images.each((i) => {
      const url = $($(".a-button-thumbnail img")[i]).attr("src");
      const match = url?.match(/I\/(.+)\._AC/);
      if (match) {
        images.push(`https://images-na.ssl-images-amazon.com/images/I/${match[1]}.jpg`);
      }
    });
  }
  return images;
};
