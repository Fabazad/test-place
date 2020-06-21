import React, {useState} from "react";
import Button from "reactstrap/es/Button";
import PropTypes from "prop-types";
import NewTestRequestModal from "../Modals/NewTestRequestModal/NewTestRequestModal";
import testServices from "../../services/test.services";
import NewTestModal from "../Modals/NewTestModal";
import Loading from "../Loading";
import confirmHelper from "../../helpers/confirmHelper";

const NewTestButton = (props) => {
    const {productId, disabled} = props;
    const [statuses, setStatuses] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    testServices.getTestStatuses().then(statuses => setStatuses(statuses));

    const handleClick = async () => {
        confirmHelper.confirm("Êtes vous sûr de vouloir tester ce produit ?", async () => {
            setLoading(true);
            try {
                await testServices.create({
                    product: productId,
                    status: statuses['requestAccepted']
                });
                onToggle();
            } catch (e) {
                console.error(e);
            }
            setLoading(false)
        });
    };

    const onToggle = () => setIsOpen(!isOpen);

    return (
        <>
            <Loading loading={loading}/>
            <Button color="info" size='lg' onClick={handleClick} disabled={disabled}>
                <i className="fa fa-bolt text-yellow mr-2"/>
                Tester le produit
            </Button>
            <NewTestModal isOpen={isOpen} onToggle={onToggle}/>
        </>
    )
};

NewTestRequestModal.propTypes = {
    productId: PropTypes.string.isRequired,
    disabled: PropTypes.bool
};

export default NewTestButton;