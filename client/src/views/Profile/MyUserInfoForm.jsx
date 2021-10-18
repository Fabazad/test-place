import Form from "reactstrap/es/Form";
import Loading from "../../components/Loading";
import FormGroup from "reactstrap/es/FormGroup";
import InfoPopover from "../../components/InfoPopover";
import Input from "reactstrap/es/Input";
import React, {useState} from "react";
import Button from "reactstrap/es/Button";
import userService from "../../services/user.services";
import {toast} from "react-toastify";
import {withTranslation} from "react-i18next";


const MyUserInfoForm = ({t}) => {
    const user = userService.currentUser;

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(user.name);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await userService.updateUserInfo(user._id, {name});
            toast.success(t("USER_NAME_UPDATED"))
        } finally {
            setLoading(false)
        }
    };

    const disabledSave = user.name === name || name.trim().length === 0;

    return (
        <Form onSubmit={handleSubmit} className="position-relative">
            <Loading loading={loading}/>
            <div>
                <h6 className="heading-small text-muted mb-4 d-inline-block">
                    {t("MY_USER_INFORMATION")}
                </h6>
                <Button size="sm" color="info" className="float-right" type="submit" disabled={disabledSave}>
                    {t("SAVE")}
                </Button>
            </div>
            <div className="pl-lg-4">
                <FormGroup>
                    <label className="form-control-label" htmlFor="input-user-name">
                        {t("USER_NAME")}
                        <InfoPopover className="ml-3">
                            {t("USER_NAME_INFO")}
                        </InfoPopover>
                    </label>
                    <Input className="form-control-alternative"
                           defaultValue={user.name}
                           id="input-user-name"
                           onChange={e => setName(e.target.value)}
                    />
                </FormGroup>
            </div>
        </Form>
    );
}

export default withTranslation()(MyUserInfoForm)