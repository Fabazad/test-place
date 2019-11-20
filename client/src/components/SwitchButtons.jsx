import React from "react";
import classnames from "classnames";
// reactstrap components
import {
  NavItem,
  NavLink,
  Nav
} from "reactstrap";

class SwitchButtons extends React.Component {

  state = {
    navPills: null
  };

  componentDidMount() {
      const value = this.props.value ? this.props.value : this.props.fields[0].value;
      this.setState({ navPills: value });
      this.props.onChange( { target: {
        name: this.props.name,
        value
      } } );
  }

  toggleNavs = (e, state, value) => {
    e.preventDefault();
    if ( this.state.navPills === value){
        return;
    }
    this.setState({
      [state]: value
    });

    this.props.onChange( { target: {
        name: this.props.name, 
        value: value
    } } );
  };

  render() {
        const fields = this.props.fields;
        return (
        <>
            <Nav
                className="nav-fill flex-column flex-sm-row"
                id="tabs-text"
                pills
                role="tablist"
            >
                { fields.map(field => (
                <NavItem key={"navItem" + field.value}>
                    <NavLink
                        aria-selected={this.state.navPills === field.value}
                        className={classnames("mb-sm-3 mb-md-0", {
                            active: this.state.navPills === field.value
                        })}
                        onClick={e => this.toggleNavs(e, "navPills", field.value)}
                        href="#"
                        role="tab"
                    >
                        {field.label}
                    </NavLink>
                </NavItem>)
                ) }
            
            </Nav>
        </>
        );
  }
}

export default SwitchButtons;