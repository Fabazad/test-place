import history from "../history";
import constants from "./constants";
const {AMAZON_PARTNER_ID} = constants;

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

export function updateURLParameters(params, pathname = history.location.pathname) {
    const newUrl = Object.keys(params).reduce((acc, key) => {
        return updateURLParameter(acc, key, params[key])
    }, pathname + history.location.search);

    history.push(newUrl);
}

export function removeUrlParameters(key) {
    let params = new URLSearchParams(history.location.search.slice(1));
    params.delete(key); //Query string is now: 'bar=2'
    const newSearch = params.toString();
    history.push(history.location.pathname + (newSearch ? "/" + newSearch : ""));
}

export function getProductAmazonUrl(asin, keywords = []) {
    const getKeywordsPath = (keywords) => {
        if (keywords && keywords.length) {
            return "?k=" + keywords.join("+");
        }
        return "";
    };
    return `https://www.amazon.fr/dp/${asin}?tag=${AMAZON_PARTNER_ID}${getKeywordsPath(keywords)}` ;
}

export function getAmazonProfileUrl(amazonId) {
    return 'https://www.amazon.fr/gp/profile/' + amazonId;
}

export function getAmazonReviewUrl(reviewId) {
    return 'https://www.amazon.fr/gp/customer-reviews/' + reviewId;
}