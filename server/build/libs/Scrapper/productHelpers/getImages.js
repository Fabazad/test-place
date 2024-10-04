
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c39b13a3-a126-54b2-becd-2348c7b261ba")}catch(e){}}();
export const getImages = ($) => {
    let $images = $(".a-button-thumbnail img");
    const images = [];
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
//# sourceMappingURL=getImages.js.map
//# debugId=c39b13a3-a126-54b2-becd-2348c7b261ba
