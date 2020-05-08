import React from "react";
// reactstrap components
import {
    Button,
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Modal,
    PopoverBody,
    Row,
    UncontrolledPopover,
    Label, Badge, UncontrolledTooltip
} from "reactstrap";
import {toast} from "react-toastify";
import Loading from "components/Loading";
import productService from "../../services/product.service";
import s3Services from "services/s3.services";
import DropdownSelect from "../DropdownSelect";
import MultiImageUploader from "../MultiImageUploader";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import RowActionButton from "../Buttons/RowActionButton";

class EditProductModal extends React.Component {

    constructor(props) {
        super(props);
        this.initialState = {
            asin: null,
            title: '',
            price: '',
            finalPrice: 0,
            images: [],
            description: '',
            isPrime: false,
            maxDemands: '',
            automaticAcceptance: true,
            exampleModal: false,
            loadingPromise: null,
            pictures: [null],
            category: ''
        };
        this.state = {
            categories: [],
            ...this.initialState
        };
    }

    componentDidMount() {
        productService.getProductCategories().then(categories => this.setState({categories}));
        this.setState({images: this.props.product.imageUrls, ...this.props.product});
    }

    toggleModal = state => {
        this.setState({
            [state]: !this.state[state]
        });
    };

    handleInputChange = (event) => {
        const {value, name} = event.target;
        this.setState({
            [name]: value
        });
    };

    handleCheckChange = (event) => {
        const {checked, name} = event.target;
        this.setState({
            [name]: checked
        });
    };

    onSubmit = (e) => {
        e.preventDefault();
        const loadingPromise = new Promise(async (resolve, reject) => {
            const {title, price, finalPrice, images, description, isPrime, maxDemands, automaticAcceptance, category} = this.state;
            const product = {
                title,
                price,
                finalPrice,
                description,
                isPrime,
                maxDemands,
                automaticAcceptance,
                category
            };

            const s3promises = [];
            images.forEach((image, index) => {
                if (typeof image === 'object') {
                    s3promises.push(
                        new Promise(async resolve => {
                            images[index] = await s3Services.upload(image);
                            resolve();
                        })
                    );
                }
            });
            await Promise.all(s3promises);
            product.imageUrls = images;
            return productService.update(this.props.product._id, product).then(() => {
                toast.success("Product updated");
                productService.productsUpdatedSubject.next();
            }).catch(reject);
        });

        this.setState({loadingPromise});
    };

    render() {
        const {product} = this.props;
        return (
            <>
                {/* Button trigger modal */}
                <RowActionButton title="Editer" icon="fa fa-edit" color="warning"
                                 onClick={() => this.toggleModal("exampleModal")}/>
                {/* Modal */}
                <Modal
                    className="modal-dialog-centered"
                    isOpen={this.state.exampleModal}
                    toggle={() => this.toggleModal("exampleModal")}
                    size="lg"
                >
                    <Loading promise={this.state.loadingPromise}/>
                    <Form role="form" onSubmit={this.onSubmit}>
                        <div className="modal-header bg-secondary">
                            <h2 className="modal-title" id="exampleModalLabel">
                                Editer Produit
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
                            <div className="border-top">
                                <div className="w-100 my-3">
                                    <MultiImageUploader images={this.state.images} maxFile={6}
                                                        onChange={images => this.setState({images})}/>

                                </div>
                            </div>
                            <div className="border-top border-bottom">
                                <Row>
                                    <div className="col-12">
                                        <FormGroup className="mb-3">
                                            <Label>ASIN</Label>
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText className={"bg-light"}>
                                                        <i className="fa fa-hashtag"/>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    className="pl-2"
                                                    placeholder="ASIN"
                                                    type="text"
                                                    name="asin"
                                                    value={this.state.asin}
                                                    required disabled
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                    </div>
                                </Row>
                                <div className="row">
                                    <div className="col-12">
                                        <FormGroup className="mb-3">
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="fa fa-angle-right"/>
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
                                </div>
                                <Row className="mb-3">
                                    <div className="col-6">
                                        <DropdownSelect name={"category"} options={this.state.categories}
                                                        className={"w-100"} value={this.state.category}
                                                        onChange={this.handleInputChange} placeholder={"Catégorie"}/>
                                    </div>
                                    <div className="col-6 text-center d-flex">
                                        <label className="custom-toggle mt-2">
                                            <input type="checkbox" name="isPrime" checked={this.state.isPrime}
                                                   onChange={this.handleCheckChange} id="isPrimeInput"/>
                                            <span className="custom-toggle-slider rounded-circle"/>
                                        </label>
                                        <label htmlFor="isPrimeInput" className="mt-2 ml-2">
                                            <img src={require("assets/img/icons/prime.png")} alt="prime"
                                                 style={{"height": "18px"}}/>
                                        </label>
                                    </div>
                                </Row>
                                <div className="row">
                                    <div className="col-6">
                                        <FormGroup className="mb-3">
                                            <InputGroup className="input-group-alternative">
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
                                                <InputGroupAddon addonType="append">
                                                    <InputGroupText>
                                                        <i className="fa fa-euro"/>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </FormGroup>
                                    </div>
                                    <div className="col-6">
                                        <FormGroup className="mb-3">
                                            <InputGroup className="input-group-alternative">
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
                                                <InputGroupAddon addonType="append">
                                                    <InputGroupText>
                                                        <i className="fa fa-euro"/>
                                                    </InputGroupText>
                                                </InputGroupAddon>
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
                            <div className="mt-3">
                                <div className="row">
                                    <FormGroup className="col-md-6 col-12">
                                        <InputGroup className="input-group-alternative">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="fa fa-user"/>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                placeholder="Nombre maximum de demande"
                                                type="number"
                                                step="1"
                                                min="1"
                                                name="maxDemands"
                                                value={this.state.maxDemands}
                                                onChange={this.handleInputChange}
                                                required
                                            />
                                        </InputGroup>
                                    </FormGroup>
                                    <FormGroup className="col-md-6 col-12">
                                        <div className="custom-control custom-control-alternative custom-checkbox mt-2">
                                            <input
                                                className="custom-control-input"
                                                id="customCheck6"
                                                type="checkbox"
                                                name="automaticAcceptance"
                                                checked={this.state.automaticAcceptance}
                                                onChange={this.handleCheckChange}
                                            />
                                            <label className="custom-control-label" htmlFor="customCheck6">
                                                Acceptation automatique des demandes
                                            </label>
                                            <i className="fa fa-question-circle ml-3 cursor-pointer"
                                               id="tooltip348236073"/>
                                            <UncontrolledPopover
                                                placement="top"
                                                target="tooltip348236073"
                                                className="popover-default"
                                            >
                                                <PopoverBody className="text-center">
                                                    Permet d'afficher le bouton qui permet aux testeurs d'avoir
                                                    directement leur demande validée sans action de la part du
                                                    vendeur.<br/>
                                                    Seulement les testeurs ayants souscrits à l'option premium auront la
                                                    possibilité de faire des demandes automatiques.
                                                </PopoverBody>
                                            </UncontrolledPopover>
                                        </div>
                                    </FormGroup>
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
                                Modifier
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </>
        );
    }
}

EditProductModal.propTypes = {
    product: PropTypes.object.isRequired
};

export default EditProductModal;