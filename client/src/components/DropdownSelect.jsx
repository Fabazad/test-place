import React from "react";
import '../assets/scss/animated-checks.scss';
import PropTypes from "prop-types";
import {UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem} from "reactstrap";
import {withTranslation} from "react-i18next";

class DropdownSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            option: undefined
        };
    }

    onSelectItem(option) {
        const currentValue = this.state.option ? this.state.option.value : null;
        const value = option ? option.value : null;
        if (value !== currentValue) {
            this.props.onChange({target: {name: this.props.name, value}});
        }
    }

    componentDidMount() {
        if ('value' in this.props) {
            const option = this.props.options.find(o => o.value === this.props.value);
            this.setState({option})
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if ('value' in nextProps) {
            const option = this.props.options.find(o => o.value === nextProps.value);
            this.setState({option})
        }
    }

    render() {
        const {t} = this.props;
        return (
            <UncontrolledDropdown group className={'w-100 dropdown-select ' + (this.props.className ?? '')}>
                <DropdownToggle caret color="secondary"
                                className={"w-100 text-right bg-white input-group-alternative rounded"}
                                style={{'height': '46px'}}>
                    <span
                        className={"text-left w-100 d-inline-block font-weight-normal" + (this.state.option ? '' : ' text-muted')}>
                        {t(this.state.option ? this.state.option.text : this.props.placeholder)}
                    </span>
                </DropdownToggle>
                <DropdownMenu style={{'overflowY': 'auto', 'maxHeight': '500px', 'position': 'absolute !important'}}>
                    {this.props.placeholder ? (
                        <DropdownItem onClick={() => this.onSelectItem(null)}
                                      key={'option.null'} className={"cursor-pointer text-muted"}>
                            {t(this.props.placeholder)}
                        </DropdownItem>
                    ) : null}

                    {this.props.options.map((option, i) => (
                        <DropdownItem onClick={() => this.onSelectItem(option)}
                                      key={option.value + i}
                                      className={"cursor-pointer" + (this.state.option && this.state.option.value === option.value ? ' selected' : '')}>
                            {t(option.text)}
                        </DropdownItem>
                    ))}

                </DropdownMenu>
            </UncontrolledDropdown>
        );
    }
}

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
