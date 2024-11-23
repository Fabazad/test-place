import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  UncontrolledDropdown,
} from "reactstrap";
import "../assets/scss/animated-checks.scss";

const DropdownSelect = (props) => {
  const { name, options, t, className, placeholder } = props;

  const [option, setOption] = useState(null);
  const [inputValue, setInputValue] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [blurTrigger, setBlurTrigger] = useState(false);

  const toggleBlurTrigger = () => {
    setBlurTrigger(!blurTrigger);
  };

  const onSelectItem = (newOption) => {
    const currentValue = option ? option.value : null;
    const value = newOption ? newOption.value : null;
    if (value !== currentValue) {
      props.onChange({ target: { name, value } });
    }
  };

  const onInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const onInputBlur = (e) => {
    console.log({ e: e.target });
    if (!inputValue) return;
    setTimeout(() => {
      toggleBlurTrigger();
    }, 100);
    // setInputValue(option ? option.text : "");
  };

  const onInputFocus = (e) => {
    e.target.select();
    setFilteredOptions(options);
  };

  useEffect(() => {
    const option = options.find((o) => o.value === props.value);
    console.log({ props, option });
    setOption(option);
    setInputValue(option ? option.text : null);
  }, [props.value, props.options]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!inputValue) {
      setFilteredOptions(options);
      return;
    }
    if (options.some((o) => typeof o.text !== "string")) {
      setFilteredOptions(options);
      return;
    }
    setFilteredOptions(
      options.filter((o) => o.text.toLowerCase().includes(inputValue.toLowerCase()))
    );
  }, [inputValue, options]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setInputValue(option ? option.text : "");
  }, [blurTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

  console.log("TEST", !option || (option && typeof option.text === "string"));

  return (
    <UncontrolledDropdown
      group
      className={"dropdown-select " + (className ?? "")}
      onBlur={onInputBlur}
    >
      <DropdownToggle
        caret
        color="secondary"
        className={`w-100 text-right bg-white input-group-alternative rounded ${
          !option || (option && typeof option.text === "string")
            ? "my-dropdown-toggle"
            : ""
        }`}
        style={{ height: "46px" }}
      >
        {(!option || (option && typeof option.text === "string")) && (
          <Input
            className={"text-left w-100 d-inline-block font-weight-normal"}
            placeholder={t(placeholder)}
            style={{ backgroundColor: "transparent", padding: "0px", marginTop: "-10px" }}
            value={inputValue}
            onChange={onInputChange}
            onFocus={onInputFocus}
          />
        )}
        {option && typeof option.text !== "string" && (
          <span
            className={
              "text-left w-100 d-inline-block font-weight-normal" +
              (option ? "" : " text-muted")
            }
          >
            {option ? option.text : t(placeholder)}
          </span>
        )}
      </DropdownToggle>
      <DropdownMenu
        style={{ overflowY: "auto", maxHeight: "500px", position: "absolute !important" }}
      >
        {placeholder ? (
          <DropdownItem
            onClick={() => onSelectItem(null)}
            key={"option.null"}
            className={"cursor-pointer text-muted"}
          >
            {t(placeholder)}
          </DropdownItem>
        ) : null}

        {filteredOptions.map((opt, i) => (
          <DropdownItem
            onClick={() => onSelectItem(opt)}
            key={opt.value + i}
            className={
              "cursor-pointer" + (option && option.value === opt.value ? " selected" : "")
            }
          >
            {typeof opt.text === "string" ? t(opt.text) : opt.text}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

DropdownSelect.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default withTranslation()(DropdownSelect);
