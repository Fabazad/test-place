import React from "react";

// reactstrap components
import { Button } from "reactstrap";
import { eraseCookie } from "helpers/cookies";

class LogoutButton extends React.Component {

    onLogout() {
        eraseCookie("token");
        this.props.history.push("/landing");
    }

  render() {
    return (
      <>
        <Button
            className="btn-neutral btn-icon"
            color="default"
            onClick={() => this.onLogout()}
        >
            <span className="btn-inner--icon">
                <i className="fa fa-cloud-download mr-2" />
            </span>
            <span className="nav-link-inner--text ml-1">
                Logout
            </span>
        </Button>
      </>
    );
  }
}

export default LogoutButton;
