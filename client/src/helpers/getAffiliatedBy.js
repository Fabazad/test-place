import Cookies from "js-cookie";

export const getAffiliatedByFromUrl = ({ history }) => {
  return (
    new URLSearchParams(history.location.search).get("affiliatedBy") ||
    new URLSearchParams(history.location.search).get("a")
  );
};

export const getAffiliatedBy = ({ history }) => {
  const affiliatedByFromCookie = Cookies.get("affiliatedBy");

  if (!affiliatedByFromCookie) {
    return getAffiliatedByFromUrl({ history }) || undefined;
  }
  return affiliatedByFromCookie || undefined;
};
