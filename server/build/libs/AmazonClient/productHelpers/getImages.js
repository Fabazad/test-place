
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="15e5238d-c94a-5ab0-b2bf-ffc1d3222d1e")}catch(e){}}();
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
//# debugId=15e5238d-c94a-5ab0-b2bf-ffc1d3222d1e
