import React, {useEffect, useState} from "react";
import '../assets/scss/animated-checks.scss';
import PropTypes from "prop-types";
import {UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem} from "reactstrap";
import {withTranslation} from "react-i18next";

const DropdownSelect = props => {

    const {name, options, t, className, placeholder} = props;

    const [option, setOption] = useState(null);

    const onSelectItem = (newOption) => {
        const currentValue = option ? option.value : null;
        const value = newOption ? newOption.value : null;
        if (value !== currentValue) {
            props.onChange({target: {name, value}});
        }
    };

    useEffect(() => {
        const option = options.find(o => o.value === props.value);
        setOption(option);
    }, [props.value]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <UncontrolledDropdown group className={'dropdown-select ' + (className ?? '')}>
            <DropdownToggle caret color="secondary"
                            className={"w-100 text-right bg-white input-group-alternative rounded"}
                            style={{'height': '46px'}}>
                    <span
                        className={"text-left w-100 d-inline-block font-weight-normal" + (option ? '' : ' text-muted')}>
                        {option ? typeof option.text === "string" ? t(option.text) : option.text : t(placeholder)}
                    </span>
            </DropdownToggle>
            <DropdownMenu style={{'overflowY': 'auto', 'maxHeight': '500px', 'position': 'absolute !important'}}>
                {placeholder ? (
                    <DropdownItem onClick={() => onSelectItem(null)}
                                  key={'option.null'} className={"cursor-pointer text-muted"}>
                        {t(placeholder)}
                    </DropdownItem>
                ) : null}

                {options.map((opt, i) => (
                    <DropdownItem onClick={() => onSelectItem(opt)}
                                  key={opt.value + i}
                                  className={"cursor-pointer" + (option && option.value === opt.value ? ' selected' : '')}>
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
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        text: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })).isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default withTranslation()(DropdownSelect);
