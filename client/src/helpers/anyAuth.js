import React, { Component } from 'react';
import DemoNavbar from 'components/Navbars/DemoNavbar';

export default function withAuth(ComponentToProtect) {
  return class extends Component {
    render() {
      return (
        <React.Fragment>
          <DemoNavbar {...this.props}/>
          <ComponentToProtect {...this.props} />
        </React.Fragment>
      );
    }
  }
}