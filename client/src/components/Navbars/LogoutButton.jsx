import React from "react";

// reactstrap components
import userServices from "../../services/user.services";

class LogoutButton extends React.Component {

    onLogout() {
        userServices.logout();
        this.props.history.push("/");
    }

    render() {
        return (
            <span className="nav-link-inner--text" onClick={() => this.onLogout()} data-testid="logout-button">
                <i className="fa fa-sign-out-alt mr-3 text-danger"/>Déconnexion
            </span>
        );
    }
}

export default LogoutButton;
