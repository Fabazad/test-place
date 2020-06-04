import TesterInfoForm from "../../Forms/TesterInfoForm";
import React from "react";
import PropTypes from "prop-types";

const BecomeTesterBody = props => {

    const onSaved = () => {
        if (props.onSaved) props.onSaved();
    };

    return (
        <>
            <p className="mb-3">
                Vous devez d'abord remplir une première fois ces informations pour pouvoir tester.
            </p>
            <div className="bg-secondary rounded p-3 shadow">
                <TesterInfoForm onSaved={onSaved} btnText="Enregistrer" addRole={true}/>
            </div>
        </>
    )
};

BecomeTesterBody.propTypes = {
    onSaved: PropTypes.func
};

export default BecomeTesterBody;