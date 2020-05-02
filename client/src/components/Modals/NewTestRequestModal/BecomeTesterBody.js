import TesterInfoForm from "../../Forms/TesterInfoForm";
import React, {useState} from "react";
import userServices from "../../../services/user.services";
import Button from "reactstrap/es/Button";
import constants from "../../../helpers/constants";
import Loading from "../../Loading";
import PropTypes from "prop-types";

const {USER_ROLES} = constants;

const BecomeTesterBody = props => {

    const {onSaved} = props;

    const [loading, setLoading] = useState(false);

    const currentUser = userServices.currentUser;

    const onBecomeTesterClick = () => {
        userServices.updateUserInfo(currentUser._id, {roles: currentUser.roles.concat([USER_ROLES.TESTER])})
            .then(() => {
                setLoading(false);
                onSaved();
            })
            .catch(() => setLoading(false));
    };

    return (
        <>
            <Loading loading={loading}/>
            {currentUser.amazonId && currentUser.paypalEmail ? (
                <>
                    <p className="mb-3">Vous n'êtes pas encore Testeur.</p>
                    <Button color="primary" onClick={onBecomeTesterClick}>Devenir Testeur</Button>
                </>
            ) : (
                <>
                    <p className="mb-3">
                        Vous devez d'abord remplir une première fois ces informations pour pouvoir tester.
                    </p>
                    <div className="bg-secondary rounded p-3 shadow">
                        <TesterInfoForm onSaved={onSaved} btnText="Devenir Testeur"/>
                    </div>
                </>
            )}
        </>
    )
};

BecomeTesterBody.propTypes = {
    onSaved: PropTypes.func.isRequired
};

export default BecomeTesterBody;