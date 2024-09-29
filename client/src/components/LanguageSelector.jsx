import i18n from "i18next";
import React from "react";
import userService from "../services/user.services";
import DropdownSelect from "./DropdownSelect";

const options = [
  {
    text: (
      <img className="language-flag" src={require("assets/img/flags/france_flag.png")} />
    ),
    value: "fr",
  },
  {
    text: (
      <img className="language-flag" src={require("assets/img/flags/english_flag.png")} />
    ),
    value: "en",
  },
  {
    text: (
      <img className="language-flag" src={require("assets/img/flags/china_flag.png")} />
    ),
    value: "ch",
  },
  {
    text: (
      <img
        className="language-flag"
        src={require("assets/img/flags/bangladesh_flag.png")}
      />
    ),
    value: "bd",
  },
];

const LanguageSelector = () => {
  const value = i18n.language;

  const handleChange = (val) => {
    const language = val.target.value;
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
    if (userService.currentUser) userService.updateLanguage({ language });
  };

  return (
    <DropdownSelect
      className="language-selector"
      name="language"
      onChange={handleChange}
      value={value}
      options={options}
    />
  );
};

export default LanguageSelector;
