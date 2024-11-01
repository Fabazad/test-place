export const getImages = ($: cheerio.Root): Array<string> => {
  let $images = $(".a-button-thumbnail img");
  const images: Array<string> = [];

  if (!$images.length) {
    $images = $("#altImages img");
  }

  if ($images.length) {
    $images.each((i, el) => {
      const url = $(el).attr("src");
      const match = url?.match(/I\/(.+)\._/);
      if (match) {
        images.push(`https://images-na.ssl-images-amazon.com/images/I/${match[1]}.jpg`);
      }
    });
  }

  return images;
};
