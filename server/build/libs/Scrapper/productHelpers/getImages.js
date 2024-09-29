
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="1fc320aa-7860-5b53-a690-90d49a5f0609")}catch(e){}}();
export const getImages = ($) => {
    const $images = $(".a-button-thumbnail img");
    const images = [];
    if ($images.length) {
        $images.each((i) => {
            const url = $($(".a-button-thumbnail img")[i]).attr("src");
            const match = url?.match(/I\/(.+)\._/);
            if (match) {
                images.push(`https://images-na.ssl-images-amazon.com/images/I/${match[1]}.jpg`);
            }
        });
    }
    return images;
};
[
    {
        hiRes: "https://m.media-amazon.com/images/I/81wPJrDfhpL._SL1500_.jpg",
        thumb: "https://m.media-amazon.com/images/I/51mWsy96ZfL._SX38_SY50_CR,0,0,38,50_.jpg",
        large: "https://m.media-amazon.com/images/I/51mWsy96ZfL.jpg",
        main: {
            "https://m.media-amazon.com/images/I/81wPJrDfhpL._SX342_.jpg": [342, 342],
            "https://m.media-amazon.com/images/I/81wPJrDfhpL._SX385_.jpg": [385, 385],
            "https://m.media-amazon.com/images/I/81wPJrDfhpL._SX425_.jpg": [425, 425],
            "https://m.media-amazon.com/images/I/81wPJrDfhpL._SX466_.jpg": [466, 466],
            "https://m.media-amazon.com/images/I/81wPJrDfhpL._SX522_.jpg": [522, 522],
        },
        variant: "MAIN",
        lowRes: null,
        shoppableScene: null,
    },
    {
        hiRes: "https://m.media-amazon.com/images/I/818CBiTuQEL._SL1500_.jpg",
        thumb: "https://m.media-amazon.com/images/I/51CbAy-1PWL._SX38_SY50_CR,0,0,38,50_.jpg",
        large: "https://m.media-amazon.com/images/I/51CbAy-1PWL.jpg",
        main: {
            "https://m.media-amazon.com/images/I/818CBiTuQEL._SX342_.jpg": [342, 342],
            "https://m.media-amazon.com/images/I/818CBiTuQEL._SX385_.jpg": [385, 385],
            "https://m.media-amazon.com/images/I/818CBiTuQEL._SX425_.jpg": [425, 425],
            "https://m.media-amazon.com/images/I/818CBiTuQEL._SX466_.jpg": [466, 466],
            "https://m.media-amazon.com/images/I/818CBiTuQEL._SX522_.jpg": [522, 522],
        },
        variant: "PT01",
        lowRes: null,
        shoppableScene: null,
    },
    {
        hiRes: "https://m.media-amazon.com/images/I/81YJRUxrLSL._SL1500_.jpg",
        thumb: "https://m.media-amazon.com/images/I/51jT17hz1zL._SX38_SY50_CR,0,0,38,50_.jpg",
        large: "https://m.media-amazon.com/images/I/51jT17hz1zL.jpg",
        main: {
            "https://m.media-amazon.com/images/I/81YJRUxrLSL._SX342_.jpg": [342, 342],
            "https://m.media-amazon.com/images/I/81YJRUxrLSL._SX385_.jpg": [385, 385],
            "https://m.media-amazon.com/images/I/81YJRUxrLSL._SX425_.jpg": [425, 425],
            "https://m.media-amazon.com/images/I/81YJRUxrLSL._SX466_.jpg": [466, 466],
            "https://m.media-amazon.com/images/I/81YJRUxrLSL._SX522_.jpg": [522, 522],
        },
        variant: "PT02",
        lowRes: null,
        shoppableScene: null,
    },
    {
        hiRes: "https://m.media-amazon.com/images/I/81ishQ6L+YL._SL1500_.jpg",
        thumb: "https://m.media-amazon.com/images/I/51CDpU4XNtL._SX38_SY50_CR,0,0,38,50_.jpg",
        large: "https://m.media-amazon.com/images/I/51CDpU4XNtL.jpg",
        main: {
            "https://m.media-amazon.com/images/I/81ishQ6L+YL._SX342_.jpg": [342, 342],
            "https://m.media-amazon.com/images/I/81ishQ6L+YL._SX385_.jpg": [385, 385],
            "https://m.media-amazon.com/images/I/81ishQ6L+YL._SX425_.jpg": [425, 425],
            "https://m.media-amazon.com/images/I/81ishQ6L+YL._SX466_.jpg": [466, 466],
            "https://m.media-amazon.com/images/I/81ishQ6L+YL._SX522_.jpg": [522, 522],
        },
        variant: "PT03",
        lowRes: null,
        shoppableScene: null,
    },
    {
        hiRes: "https://m.media-amazon.com/images/I/810wsIpKpzL._SL1500_.jpg",
        thumb: "https://m.media-amazon.com/images/I/51e1ZurPHML._SX38_SY50_CR,0,0,38,50_.jpg",
        large: "https://m.media-amazon.com/images/I/51e1ZurPHML.jpg",
        main: {
            "https://m.media-amazon.com/images/I/810wsIpKpzL._SX342_.jpg": [342, 342],
            "https://m.media-amazon.com/images/I/810wsIpKpzL._SX385_.jpg": [385, 385],
            "https://m.media-amazon.com/images/I/810wsIpKpzL._SX425_.jpg": [425, 425],
            "https://m.media-amazon.com/images/I/810wsIpKpzL._SX466_.jpg": [466, 466],
            "https://m.media-amazon.com/images/I/810wsIpKpzL._SX522_.jpg": [522, 522],
        },
        variant: "PT04",
        lowRes: null,
        shoppableScene: null,
    },
    {
        hiRes: "https://m.media-amazon.com/images/I/81DSPq0uXnL._SL1500_.jpg",
        thumb: "https://m.media-amazon.com/images/I/514UJ0KCJRL._SX38_SY50_CR,0,0,38,50_.jpg",
        large: "https://m.media-amazon.com/images/I/514UJ0KCJRL.jpg",
        main: {
            "https://m.media-amazon.com/images/I/81DSPq0uXnL._SX342_.jpg": [342, 342],
            "https://m.media-amazon.com/images/I/81DSPq0uXnL._SX385_.jpg": [385, 385],
            "https://m.media-amazon.com/images/I/81DSPq0uXnL._SX425_.jpg": [425, 425],
            "https://m.media-amazon.com/images/I/81DSPq0uXnL._SX466_.jpg": [466, 466],
            "https://m.media-amazon.com/images/I/81DSPq0uXnL._SX522_.jpg": [522, 522],
        },
        variant: "PT05",
        lowRes: null,
        shoppableScene: null,
    },
    {
        hiRes: "https://m.media-amazon.com/images/I/81WlxRP41ML._SL1500_.jpg",
        thumb: "https://m.media-amazon.com/images/I/51-NqXRRSrL._SX38_SY50_CR,0,0,38,50_.jpg",
        large: "https://m.media-amazon.com/images/I/51-NqXRRSrL.jpg",
        main: {
            "https://m.media-amazon.com/images/I/81WlxRP41ML._SX342_.jpg": [342, 342],
            "https://m.media-amazon.com/images/I/81WlxRP41ML._SX385_.jpg": [385, 385],
            "https://m.media-amazon.com/images/I/81WlxRP41ML._SX425_.jpg": [425, 425],
            "https://m.media-amazon.com/images/I/81WlxRP41ML._SX466_.jpg": [466, 466],
            "https://m.media-amazon.com/images/I/81WlxRP41ML._SX522_.jpg": [522, 522],
        },
        variant: "PT06",
        lowRes: null,
        shoppableScene: null,
    },
    {
        hiRes: "https://m.media-amazon.com/images/I/81czcibj7+L._SL1500_.jpg",
        thumb: "https://m.media-amazon.com/images/I/61MATFc5V4L._SX38_SY50_CR,0,0,38,50_.jpg",
        large: "https://m.media-amazon.com/images/I/61MATFc5V4L.jpg",
        main: {
            "https://m.media-amazon.com/images/I/81czcibj7+L._SX342_.jpg": [342, 342],
            "https://m.media-amazon.com/images/I/81czcibj7+L._SX385_.jpg": [385, 385],
            "https://m.media-amazon.com/images/I/81czcibj7+L._SX425_.jpg": [425, 425],
            "https://m.media-amazon.com/images/I/81czcibj7+L._SX466_.jpg": [466, 466],
            "https://m.media-amazon.com/images/I/81czcibj7+L._SX522_.jpg": [522, 522],
        },
        variant: "PT07",
        lowRes: null,
        shoppableScene: null,
    },
    {
        hiRes: "https://m.media-amazon.com/images/I/91ZVYKH26nL._SL1500_.jpg",
        thumb: "https://m.media-amazon.com/images/I/61BwcsNxArL._SX38_SY50_CR,0,0,38,50_.jpg",
        large: "https://m.media-amazon.com/images/I/61BwcsNxArL.jpg",
        main: {
            "https://m.media-amazon.com/images/I/91ZVYKH26nL._SX342_.jpg": [342, 342],
            "https://m.media-amazon.com/images/I/91ZVYKH26nL._SX385_.jpg": [385, 385],
            "https://m.media-amazon.com/images/I/91ZVYKH26nL._SX425_.jpg": [425, 425],
            "https://m.media-amazon.com/images/I/91ZVYKH26nL._SX466_.jpg": [466, 466],
            "https://m.media-amazon.com/images/I/91ZVYKH26nL._SX522_.jpg": [522, 522],
        },
        variant: "PT08",
        lowRes: null,
        shoppableScene: null,
    },
];
//# sourceMappingURL=getImages.js.map
//# debugId=1fc320aa-7860-5b53-a690-90d49a5f0609
