import {Button, Form, FormGroup} from "reactstrap";
import Loading from "../../components/Loading";
import Label from "reactstrap/es/Label";
import RolesSelectInput from "../../components/Forms/RolesSelectInput";
import userService from "../../services/user.services";
import React, {useState} from "react";
import PropTypes from "prop-types";
import {toast} from "react-toastify";
import TesterInfoModal from "../../components/Modals/TesterInfoModal";
import constants from "../../helpers/constants";

const {USER_ROLES} = constants;

const MyInfoForm = props => {

    const {user} = props;

    const [roles, setRoles] = useState(user.roles);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [modalCallback, setModalCallback] = useState(null);

    const toggleModal = (callback = null) => {
        setIsOpen(!isOpen);
        if (callback) {
            setModalCallback(() => callback);
        }
    };

    const disabledSave = user.roles.join(',') === roles.join(',');

    const onRoleChange = val => {
        if (val.includes(USER_ROLES.TESTER) && (!user.paypalEmail || !user.amazonId)) {
            toggleModal(() => setRoles(val));
            return;
        }
        setRoles(val);
    };

    const onSubmit = e => {
        e.preventDefault();
        setLoading(true);

        userService.updateUserInfo(userService.currentUser._id, {roles})
            .catch(() => setLoading(false))
            .then(() => {
                setLoading(false);
                toast.success("Modifications Enregistrées");
            });
    };

    return (
        <>
            <Form onSubmit={onSubmit} className="position-relative">
                <Loading loading={loading}/>
                <h6 className="heading-small text-muted mb-4 d-inline-block">
                    Mes Informations
                </h6>
                <Button size="sm" color="info" className="float-right" type="submit" disabled={disabledSave}>
                    Enregister
                </Button>
                <div className="pl-lg-4">
                    <FormGroup>
                        <Label className="form-control-label">Vous êtes ?</Label>
                        <RolesSelectInput value={roles} onChange={onRoleChange}/>
                    </FormGroup>
                </div>
            </Form>
            <TesterInfoModal isOpen={isOpen} toggleModal={toggleModal} onSaved={modalCallback}/>
        </>
    )
};

MyInfoForm.propTypes = {
    user: PropTypes.object.isRequired
};

export default MyInfoForm;