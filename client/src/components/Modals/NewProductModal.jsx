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
import Loading from "components/Loading";
import productService from "services/product.service";
//import PropTypes from 'prop-types';

class NewProductModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      asin : '',
      title : '',
      price : '',
      finalPrice: '',
      src: '',
      description: '',
      isPrime: false,
      afterNote: '',
      beforeNote: '',
      exampleModal: false,
      loadingPromise: null
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

  handleCheckChange = (event) => {
    const { checked, name } = event.target;
    this.setState({
      [name]: checked
    });
  };

  scrapAsin() {
    const loadingPromise = productService.scrapFromAsin(this.state.asin).then(res => {
        this.setState({
            title: res.title,
            price : res.price,
            description : res.description,
            src: res.imageSrc,
            isPrime: res.isPrime
        });
    });
    this.setState({ loadingPromise });
  }

  onSubmit = (e) => {
    e.preventDefault();
    const loadingPromise = userService.sendResetPasswordMail(this.state.email)
      .then(() => {
        toast.success("Un mail a été envoyé.");
        this.setState({email: ''});
        this.toggleModal("exampleModal");
      })
      .catch(() => toast.error("Le mail n'a pas pu être envoyé."));
    this.setState({ loadingPromise });
  }
  
  render() {
    return (
      <>
        {/* Button trigger modal */}
        <Button
            color="primary"
            onClick={() => this.toggleModal("exampleModal")}
        >
            Nouveau Produit
        </Button>
        {/* Modal */}
        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.exampleModal}
          toggle={() => this.toggleModal("exampleModal")}
          size="lg"
        >
          <Loading promise={this.state.loadingPromise} />
          <Form role="form" onSubmit={this.onSubmit}>
            <div className="modal-header bg-secondary">
              <h2 className="modal-title" id="exampleModalLabel">
                Nouveau Produit
              </h2>
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
                <div className="border-bottom">
                    <FormGroup className="mb-3">
                        <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                            <i className="fa fa-hashtag" />
                            </InputGroupText>
                        </InputGroupAddon>
                        <Input 
                            placeholder="ASIN ou Lien amazon du produit" 
                            type="text" 
                            name="asin"
                            value={this.state.asin} 
                            onChange={this.handleInputChange}
                        />
                        </InputGroup>
                        </FormGroup>
                    <Button color="success" className="mb-3 w-100" onClick={() => this.scrapAsin()}>Pré-Remplir</Button>
                </div>
                <div className="border-bottom">
                    <div className="w-100 text-center my-3">
                        <img src={this.state.src} alt="" className="img-fluid rounded shadow-lg" style={{"maxHeight": "200px", "maxWidth": "200px"}}/>
                    </div>
                    <div className="row">
                    <div className="col-9">
                        <FormGroup className="mb-3">
                            <InputGroup className="input-group-alternative">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                    <i className="fa fa-angle-right" />
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input 
                                    placeholder="Titre" 
                                    type="text" 
                                    name="title"
                                    value={this.state.title} 
                                    onChange={this.handleInputChange}
                                    required
                                />
                            </InputGroup>
                        </FormGroup>
                    </div>
                    <div className="col-3">
                        <div className="custom-control custom-control-alternative custom-checkbox mb-3">
                            <input
                                className="custom-control-input"
                                id="customCheck5"
                                type="checkbox"
                                name="isPrime"
                                checked={this.state.isPrime}
                                onChange={this.handleCheckChange}
                            />
                            <label className="custom-control-label" htmlFor="customCheck5">
                                <img src={require("assets/img/icons/prime.png")} alt="prime" style={{"height": "24px"}}/>
                            </label>
                        </div>
                    </div>
                </div>
                    <div className="row">
                <div className="col-6">
                <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                            <i className="fa fa-euro" />
                            </InputGroupText>
                        </InputGroupAddon>
                        <Input 
                            placeholder="Prix" 
                            type="number"
                            step="0.01"
                            min="0.01"
                            name="price"
                            value={this.state.price} 
                            onChange={this.handleInputChange}
                            required
                        />
                    </InputGroup>
                </FormGroup>
                </div>
                <div className="col-6">
                    <FormGroup className="mb-3">
                        <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                <i className="fa fa-euro" />
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input 
                                placeholder="Prix Final" 
                                type="number"
                                step="0.01"
                                min="0"
                                name="finalPrice"
                                value={this.state.finalPrice} 
                                onChange={this.handleInputChange}
                                required
                            />
                        </InputGroup>
                    </FormGroup>
                </div>
            </div>
                
                    <FormGroup className="mb-3">
                        <Input
                            className="form-control-alternative"
                            placeholder="Description"
                            rows="10"
                            type="textarea"
                            name="description"
                            value={this.state.description} 
                            onChange={this.handleInputChange}
                            required
                        />
                    </FormGroup>
                </div>
                <div class="mt-3">
                    <div className="row">
                <div className="col-6">
                <Input
                    className="form-control-alternative"
                    placeholder="Note visible AVANT une demande"
                    rows="3"
                    type="textarea"
                    name="beforeNote"
                    value={this.state.beforeNote} 
                    onChange={this.handleInputChange}
                    required
                />
                </div>
                <div className="col-6">
                    <Input
                        className="form-control-alternative"
                        placeholder="Note visible APRES une demande"
                        rows="3"
                        type="textarea"
                        name="afterNote"
                        value={this.state.afterNote} 
                        onChange={this.handleInputChange}
                        required
                    />
                </div>
            </div>
                </div>
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
                Ajouter
                </Button>
            </div>
          </Form>
        </Modal>
      </>
    );
  }
}

NewProductModal.propTypes = {
}

export default NewProductModal;