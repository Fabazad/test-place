import React, {useState} from 'react';
import Form from "reactstrap/es/Form";
import Loading from "../../components/Loading";
import {Button, Col, FormGroup, Input, Row} from "reactstrap";
import userService from "../../services/user.services";
import InfoPopover from "../../components/InfoPopover";
import {toast} from "react-toastify";
import PropTypes from "prop-types";

const MyTesterInfoForm = props => {

    const {user} = props;

    const [loading, setLoading] = useState(false);
    const [testerMessage, setTesterMessage] = useState(user.testerMessage);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        userService.updateUserInfo(userService.currentUser._id, { testerMessage })
            .catch(() => setLoading(false))
            .then(() => {
                setLoading(false);
                toast.success("Modifications Enregistrées");
            });
    };

    const disabledSave = user.testerMessage === testerMessage;

    return (
        <Form onSubmit={handleSubmit} className="position-relative">
            <Loading loading={loading}/>
            <div>
                <h6 className="heading-small text-muted mb-4 d-inline-block">
                    Mes Informations Testeur
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
                            <label className="form-control-label"
                                   htmlFor="input-tester-message">
                                Message Testeur
                                <InfoPopover className="ml-3">
                                    Le champ texte <b><i>Message au Vendeur</i></b> à
                                    fournir lors
                                    d'une demande de test sera pré-rempli avec ce <b><i>Message
                                    Testeur</i></b>.
                                </InfoPopover>
                            </label>
                            <Input className="form-control-alternative"
                                   defaultValue={user.testerMessage}
                                   id="input-tester-message"
                                   placeholder={"Bonjour, je suis " + user.name + "..."}
                                   type="textarea" name="testerMessage"
                                   onChange={e => setTesterMessage(e.target.value)}
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </div>
        </Form>
    );
};

MyTesterInfoForm.propTypes = {
    user: PropTypes.object.isRequired
};

export default MyTesterInfoForm;
