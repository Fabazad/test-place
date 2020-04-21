import {Button, Col, Form, FormGroup, Input, Row} from "reactstrap";
import Loading from "../../components/Loading";
import Label from "reactstrap/es/Label";
import RolesSelectInput from "../../components/Forms/RolesSelectInput";
import userService from "../../services/user.services";
import InfoPopover from "../../components/InfoPopover";
import React, {useState} from "react";
import PropTypes from "prop-types";
import {toast} from "react-toastify";

const MyInfoForm = props => {
    
    const {user} = props;

    const [testerMessage, setTesterMessage] = useState(user.testerMessage);
    const [roles, setRoles] = useState(user.roles);
    const [loading, setLoading] = useState(false);

    const disabledSave = user.testerMessage === testerMessage && user.roles.join(',') === roles.join(',');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // TODO
        /*if (roles.includes(USER_ROLES.TESTER) && !userService.getAmazonId()) {
            toast.error('Pour devenir Testeur, vous devez d\'abord lier votre compte Test-Place à un compte Amazon.');
            scrollTo('actions-section');
            setLoading(false);
            return;
        }*/

        userService.updateUserInfo(userService.currentUser._id, { testerMessage, roles })
            .catch(() => setLoading(false))
            .then(() => {
                setLoading(false);
                toast.success("Modifications Enregistrées");
            });
    };
    
    return (
        <Form onSubmit={handleSubmit} className="position-relative">
            <Loading loading={loading}/>
            <div>
                <h6 className="heading-small text-muted mb-4 d-inline-block">
                    Mes Informations
                </h6>
                <Button size="sm" color="info" className="float-right" type="submit"
                        disabled={disabledSave}>
                    Enregister
                </Button>
            </div>
            <div className="pl-lg-4">
                <Row>
                    <Col xs="12">
                        <FormGroup>
                            <Label className="form-control-label">Vous êtes ?</Label>
                            <RolesSelectInput defaultValue={userService.currentUser.roles}
                                              onChange={val => setRoles(val)} />
                        </FormGroup>
                    </Col>
                </Row>
            </div>
        </Form>
    )
};

MyInfoForm.propTypes = {
    user: PropTypes.object.isRequired
};

export default MyInfoForm;