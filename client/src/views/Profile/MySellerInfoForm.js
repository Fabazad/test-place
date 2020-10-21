import React, {useState} from 'react';
import Form from "reactstrap/es/Form";
import Loading from "../../components/Loading";
import {Button, Col, FormGroup, Input, Row} from "reactstrap";
import userService from "../../services/user.services";
import InfoPopover from "../../components/InfoPopover";
import {toast} from "react-toastify";
import PropTypes from "prop-types";
import {withTranslation, Trans} from "react-i18next";

const MySellerInfoForm = props => {

    const {user, t} = props;

    const [loading, setLoading] = useState(false);
    const [sellerMessage, setSellerMessage] = useState(user.sellerMessage);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        userService.updateUserInfo(userService.currentUser._id, {sellerMessage})
            .catch(() => setLoading(false))
            .then(() => {
                setLoading(false);
                toast.success(t("UPDATES_SAVED"));
            });
    };

    const disabledSave = user.sellerMessage === sellerMessage;

    return (
        <Form onSubmit={handleSubmit} className="position-relative">
            <Loading loading={loading}/>
            <div>
                <h6 className="heading-small text-muted mb-4 d-inline-block">
                    {t("MY_SELLER_INFO")}
                </h6>
                <Button size="sm" color="info" className="float-right" type="submit" disabled={disabledSave}>
                    {t("SAVE")}
                </Button>
            </div>
            <div className="pl-lg-4">
                <Row>
                    <Col xs="12">
                        <FormGroup>
                            <label className="form-control-label" htmlFor="input-seller-message">
                                {t("SELLER_MESSAGE")}
                                <InfoPopover className="ml-3">
                                    <Trans i18nKey="SELLER_MESSAGE_EXPLAINED" components={{ b: <b />, i: <i /> }}/>

                                </InfoPopover>
                            </label>
                            <Input className="form-control-alternative"
                                   defaultValue={user.sellerMessage}
                                   id="input-seller-message"
                                   placeholder={t("SELLER_MESSAGE_PLACEHOLDER")}
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

export default withTranslation()(MySellerInfoForm);
