import React from "react";

// reactstrap components
import {Button} from "reactstrap";
import {toast} from "react-toastify";
import userServices from "services/user.services";

class LogoutButton extends React.Component {

    onLogout() {
        console.log("1");
        userServices.logout();
        this.props.history.push("/");
        toast.success("Deconnecté !");
    }

    render() {
        return (
            <Button
                className="btn-neutral btn-icon"
                color="default"
                onClick={() => this.onLogout()}
            >
            <span className="nav-link-inner--text ml-1">
                Déconnexion
            </span>
            </Button>
        );
    }
}

export default LogoutButton;
