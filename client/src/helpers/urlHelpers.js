import history from "../history";

export function updateURLParameter(url, param, paramVal) {
  let newAdditionalURL = "";
  let tempArray = url.split("?");
  let baseURL = tempArray[0];
  let additionalURL = tempArray[1];
  let temp = "";
  if (additionalURL) {
    tempArray = additionalURL.split("&");
    for (let i = 0; i < tempArray.length; i++) {
      if (tempArray[i].split("=")[0] !== param) {
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
    if (params[key] === undefined || params[key] === null || params[key] === "") {
      return acc;
    }
    return updateURLParameter(acc, key, params[key]);
  }, pathname + "?");

  console.log({ newUrl });
  history.push(newUrl);
}

export function removeUrlParameters(key) {
  let params = new URLSearchParams(history.location.search.slice(1));
  params.delete(key); //Query string is now: 'bar=2'
  const newSearch = params.toString();
  history.push(history.location.pathname + (newSearch ? "/" + newSearch : ""));
}

export function getAmazonProfileUrl(amazonId) {
  return "https://www.amazon.fr/gp/profile/" + amazonId;
}

export function getAmazonReviewUrl(reviewId) {
  return "https://www.amazon.fr/gp/customer-reviews/" + reviewId;
}
