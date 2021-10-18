import DropdownSelect from "./DropdownSelect";
import i18n from "i18next";
import React from "react"

const options = [
    { text: <img className="language-flag" src={require("assets/img/flags/france_flag.png")}/>, value: "fr"},
    { text: <img className="language-flag" src={require("assets/img/flags/english_flag.png")}/>, value: "en"},
]

const LanguageSelector = () => {

    const value = i18n.language

    const handleChange =(val) => {
        i18n.changeLanguage(val.target.value)
        localStorage.setItem("language", val.target.value)
    }

    return <DropdownSelect className="language-selector" name="language" onChange={handleChange} value={value} options={options}/>
}

export default LanguageSelector