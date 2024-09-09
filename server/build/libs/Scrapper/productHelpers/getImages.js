
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="cb3059fa-bb8f-505e-91de-012691bfb4c9")}catch(e){}}();
export const getImages = ($) => {
    const $images = $(".a-button-thumbnail img");
    const images = [];
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
//# sourceMappingURL=getImages.js.map
//# debugId=cb3059fa-bb8f-505e-91de-012691bfb4c9
