import {FormGroup, Input, Label} from "reactstrap";
import React from "react";
import PropTypes from "prop-types";

const SendRequestForm = props => {

    const {value, onChange} = props;

    return (
        <FormGroup className="text-left">
            {/* It's all good case */}
            <Label for="sellerMessage">Message au Vendeur</Label>
            <Input className="form-control-alternative" id="testerMessage"
                   defaultValue={value} required
                   placeholder="Je serai très fier de tester votre produit..."
                   type="textarea" name="testerMessage"
                   onChange={e => onChange(e.target.value)}/>
        </FormGroup>
    )
};

SendRequestForm.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

export default SendRequestForm;