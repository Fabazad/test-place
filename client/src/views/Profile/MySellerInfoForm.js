import React, {useState} from 'react';
import Form from "reactstrap/es/Form";
import Loading from "../../components/Loading";
import {Button, Col, FormGroup, Input, Row} from "reactstrap";
import userService from "../../services/user.services";
import InfoPopover from "../../components/InfoPopover";
import {toast} from "react-toastify";
import PropTypes from "prop-types";

const MySellerInfoForm = props => {

    const {user} = props;

    const [loading, setLoading] = useState(false);
    const [sellerMessage, setSellerMessage] = useState(user.sellerMessage);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        userService.updateUserInfo(userService.currentUser._id, { sellerMessage })
            .catch(() => setLoading(false))
            .then(() => {
                setLoading(false);
                toast.success("Modifications Enregistrées");
            });
    };

    const disabledSave = user.sellerMessage === sellerMessage;

    return (
        <Form onSubmit={handleSubmit} className="position-relative">
            <Loading loading={loading}/>
            <div>
                <h6 className="heading-small text-muted mb-4 d-inline-block">
                    Mes Informations Vendeur
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
                                   htmlFor="input-seller-message">
                                Message Vendeur
                                <InfoPopover className="ml-3">
                                    <b>Message Vendeur</b> sera utilisé comme message par
                                    défault lorsque vous <b>accepterez des demandes de
                                    test</b>.<br/>
                                    C'est aussi le message que recevront vos testeurs
                                    lorsqu'ils passeront par l'<b>acceptaion
                                    automatique</b> des demandes (<i
                                    className="fa fa-bolt text-yellow"/>).
                                </InfoPopover>
                            </label>
                            <Input className="form-control-alternative"
                                   defaultValue={user.sellerMessage}
                                   id="input-seller-message"
                                   placeholder={"Merci d'avoir choisi notre produit, ..."}
                                   type="textarea" name="sellerMessage"
                                   onChange={e => setSellerMessage(e.target.value)}
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </div>
        </Form>
    );
};

MySellerInfoForm.propTypes = {
    user: PropTypes.object.isRequired
};

export default MySellerInfoForm;
