import React from "react";
import '../assets/scss/animated-checks.scss';
import PropTypes from "prop-types";
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from "reactstrap";

class DropdownSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            option: undefined
        }
    }

    onSelectItem(option) {
        this.setState({ option });
        this.props.onChange(option ? option.value : null);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.value) {
            //const options = this.props.options ? this.props.options : nextProps.options;
            const option = this.props.options.find(o => o.value === nextProps.value);
            this.setState({ option })
        }
    }

    render() {
        return (
            <UncontrolledDropdown group className={this.props.className}>
                <DropdownToggle caret color="secondary" className={"w-100 text-right"}>
                    <span className={"text-left w-100 d-inline-block"}>
                        { this.state.option ? this.state.option.text : this.props.placeholder }
                    </span>
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem onClick={() => this.onSelectItem(null)}
                                  key={'option.null'} className={"cursor-pointer"}>
                        { this.props.placeholder }
                    </DropdownItem>
                    {
                        this.props.options.map(option => (
                            <DropdownItem onClick={() => this.onSelectItem(option)}
                                          key={option.value} className={"cursor-pointer"}>
                                { option.text }
                            </DropdownItem>
                        ))
                    }
                </DropdownMenu>
            </UncontrolledDropdown>
        );
    }
}

DropdownSelect.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string
    })),
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string
};

export default DropdownSelect;
