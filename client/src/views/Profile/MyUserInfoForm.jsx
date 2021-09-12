import Form from "reactstrap/es/Form";
import Loading from "../../components/Loading";
import FormGroup from "reactstrap/es/FormGroup";
import InfoPopover from "../../components/InfoPopover";
import Input from "reactstrap/es/Input";
import React, {useState} from "react";
import Button from "reactstrap/es/Button";
import userService from "../../services/user.services";
import {toast} from "react-toastify";


const MyUserInfoForm = () => {
    const user = userService.currentUser;

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(user.name);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await userService.updateUserInfo(user._id, {name});
            toast.success("Nom d'utilisateur modifié.")
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
                    Mes informations utilisateur
                </h6>
                <Button size="sm" color="info" className="float-right" type="submit" disabled={disabledSave}>
                    Enregistrer
                </Button>
            </div>
            <div className="pl-lg-4">
                <FormGroup>
                    <label className="form-control-label" htmlFor="input-user-name">
                        Nom d'utilisateur
                        <InfoPopover className="ml-3">
                            Le nom que les autres utilisateurs verront pour vous.
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

export default MyUserInfoForm