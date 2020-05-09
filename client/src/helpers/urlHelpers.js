export function updateURLParameter(url, param, paramVal) {
    let newAdditionalURL = "";
    let tempArray = url.split("?");
    let baseURL = tempArray[0];
    let additionalURL = tempArray[1];
    let temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (let i=0; i<tempArray.length; i++){
            if(tempArray[i].split('=')[0] !== param){
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    const rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

export function getProductAmazonUrl(asin) {
    return 'https://www.amazon.fr/dp/' + asin;
}

export function getAmazonProfileUrl(amazonId) {
    return 'https://www.amazon.fr/gp/profile/' + amazonId;
}