import React from "react";
// reactstrap components
import {
  Button,
  Modal,
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input
} from "reactstrap";
import { toast } from "react-toastify";
import userServices from "services/user.services";
import PasswordStrength from "components/PasswordStrength";
//import PropTypes from 'prop-types';

class UpdatePasswordModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
        previousPassword: '',
        password : '',
        password2: '',
        exampleModal: false
    };
  }

  toggleModal = state => {
    this.setState({
      [state]: !this.state[state]
    });
  };

  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    if (this.state.password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if(this.state.password !== this.state.password2) {
      toast.error("Les deux mots des passe ne sont pas identiques.");
      return;
    }
    userServices.updatePassword(this.state.previousPassword, this.state.password)
      .then(() => {
        toast.success("Mot de passe modifié.");
        this.setState({previousPassword: '', password: '', password2: ''});
        this.toggleModal("exampleModal");
      })
      .catch((err) => toast.error("Le mot de passe n'a pas été modifié."));
  }
  
  render() {
    return (
      <>
        {/* Button trigger modal */}
        <Button
          color="primary"
          size="sm"
          type="button"
          onClick={() => this.toggleModal("exampleModal")}
        >
          <small>Modifier le mot de passe</small>
        </Button>
        {/* Modal */}
        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.exampleModal}
          toggle={() => this.toggleModal("exampleModal")}
        >
            <Form role="form" onSubmit={this.onSubmit}>
                <div className="modal-header bg-secondary">
                    <h5 className="modal-title" id="exampleModalLabel">
                        Modifier le mot de passe
                    </h5>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => this.toggleModal("exampleModal")}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <div className="modal-body white-space-pre-line bg-secondary">
                    <FormGroup>
                        <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                            <i className="ni ni-lock-circle-open" />
                            </InputGroupText>
                        </InputGroupAddon>
                        <Input
                            placeholder="Mot de passe actuel"
                            type="password"
                            autoComplete="off"
                            name="previousPassword"
                            value={this.state.previousPassword} 
                            onChange={this.handleInputChange}
                            required
                        />
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                            <i className="ni ni-lock-circle-open" />
                            </InputGroupText>
                        </InputGroupAddon>
                        <Input
                            placeholder="Nouveau mot de passe"
                            type="password"
                            autoComplete="off"
                            name="password"
                            value={this.state.password} 
                            onChange={this.handleInputChange}
                            required
                        />
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                            <i className="ni ni-lock-circle-open" />
                            </InputGroupText>
                        </InputGroupAddon>
                        <Input
                            placeholder="Nouveau mot de passe"
                            type="password"
                            autoComplete="off"
                            name="password2"
                            value={this.state.password2} 
                            onChange={this.handleInputChange}
                            required
                        />
                        </InputGroup>
                    </FormGroup>
                    <PasswordStrength min={8} password={this.state.password} />
                    
                </div>
                <div className="modal-footer bg-secondary ">
                    <Button
                        color="secondary"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => this.toggleModal("exampleModal")}
                    >
                        Fermer
                    </Button>
                    <Button
                        color="primary"
                        data-dismiss="modal"
                        type="submit"
                    >
                        Envoyer
                    </Button>
                </div>
            </Form> 
        </Modal>
      </>
    );
  }
}

UpdatePasswordModal.propTypes = {
}

export default UpdatePasswordModal;