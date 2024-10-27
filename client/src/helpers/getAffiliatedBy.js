import Cookies from "js-cookie";

export const getAffiliatedByFromUrl = ({ history }) => {
  return new URLSearchParams(history.location.search).get("affiliatedBy");
};

export const getAffiliatedBy = ({ history }) => {
  const affiliatedByFromCookie = Cookies.get("affiliatedBy");

  if (!affiliatedByFromCookie) {
    return getAffiliatedByFromUrl({ history });
  }
  return affiliatedByFromCookie;
};
