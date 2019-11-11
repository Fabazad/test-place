import React from "react";

// reactstrap components
import { Button } from "reactstrap";
import { eraseCookie } from "helpers/cookies";
import { toast } from "react-toastify";

class LogoutButton extends React.Component {

    onLogout() {
        eraseCookie("token");
        this.props.history.push("/landing");
        toast.success("Deconnecté !");
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
                <i className="fa fa-sign-out mr-2" />
            </span>
            <span className="nav-link-inner--text ml-1">
                Déconnexion
            </span>
        </Button>
      </>
    );
  }
}

export default LogoutButton;
