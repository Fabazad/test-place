import React from "react";

// reactstrap components
import { Button } from "reactstrap";
import { toast } from "react-toastify";
import userServices from "services/user.services";

class LogoutButton extends React.Component {

    onLogout() {
        userServices.logout();
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
