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
import userService from "services/user.services";
//import PropTypes from 'prop-types';

class ForgottenPasswordModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email : '',
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
    userService.sendResetPasswordMail(this.state.email)
      .then(() => {
        toast.success("Un mail a été envoyé.");
        this.setState({email: ''});
        this.toggleModal("exampleModal");
      })
      .catch(() => toast.error("Le mail n'a pas pu être envoyé."));
    
    
  }
  
  render() {
    return (
      <>
        {/* Button trigger modal */}
        <a
          className="text-light"
          href="#pablo"
          onClick={() => this.toggleModal("exampleModal")}
        >
          <small>Mot de passe oublié ?</small>
        </a>
        {/* Modal */}
        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.exampleModal}
          toggle={() => this.toggleModal("exampleModal")}
        >
          <Form role="form" onSubmit={this.onSubmit}>
            <div className="modal-header bg-secondary">
              <h5 className="modal-title" id="exampleModalLabel">
                Mot de passe oublié
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
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input 
                    placeholder="Adresse mail du compte" 
                    type="email" 
                    name="email"
                    value={this.state.email} 
                    onChange={this.handleInputChange}
                    required
                  />
              </InputGroup>
            </FormGroup>
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

ForgottenPasswordModal.propTypes = {
}

export default ForgottenPasswordModal;