import React, {useState} from "react";
import Button from "reactstrap/es/Button";
import PropTypes from "prop-types";
import NewTestRequestModal from "../Modals/NewTestRequestModal";
import testServices from "../../services/test.services";
import {toast} from "react-toastify";

const NewTestButton = (props) => {
    const {productId, disabled} = props;
    const [statuses, setStatuses] = useState({});

    testServices.getTestStatuses().then(statuses => setStatuses(statuses));

    const handleClick = async () => {
        await testServices.create({
            product: productId,
            status: statuses['requestAccepted']
        });
        toast.success("Test produit créé");
    };

    return (
        <Button color="info" size='lg' onClick={handleClick} disabled={disabled}>
            <i className="fa fa-star text-yellow mr-2"/>
            Tester le produit
        </Button>
    )
};

NewTestRequestModal.propTypes = {
    productId: PropTypes.string.isRequired,
    disabled: PropTypes.bool
};

export default NewTestButton;