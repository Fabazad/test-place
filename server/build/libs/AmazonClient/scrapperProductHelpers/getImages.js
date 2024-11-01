
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="61118e40-9a7c-5df1-8c4c-a0354d7e9f93")}catch(e){}}();
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
//# debugId=61118e40-9a7c-5df1-8c4c-a0354d7e9f93
