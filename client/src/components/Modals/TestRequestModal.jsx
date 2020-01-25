import React from "react";
// reactstrap components
import {
    Button,
    Modal,
    Label
} from "reactstrap";
import userServices from '../../services/user.services';
import testServices from '../../services/test.services';
import AmazonLoginButton from "../Buttons/AmazonLoginButton";
import {Link} from "react-router-dom";
import AnimatedError from "../AnimatedError";
import PropTypes from "prop-types";
import {toast} from "react-toastify";

class TestRequestModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            amazonId: null
        }
    }

    componentDidMount() {
        this.onAmazonLogin();
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    onAmazonLogin() {
        this.setState({amazonId: userServices.amazonId});
    }

    async confirmRequest() {
        await testServices.create({ product: this.props.productId});
        toast.success("Demande envoyée.");
    }

    render() {
        return (
            <>
                {/* Button trigger modal */}
                <Button
                    className='mt-3 w-100'
                    color="primary"
                    type="button"
                    size={'lg'}
                    onClick={() => this.toggleModal()}
                >Demander à Tester</Button>
                {/* Modal */}
                <Modal
                    className="modal-dialog-centered"
                    isOpen={this.state.isModalOpen}
                    toggle={() => this.toggleModal()}
                >
                    <div className="modal-header">
                        <h2 className="modal-title">Demande de Test</h2>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => this.toggleModal()}
                        >
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body text-center">
                        {
                            userServices.isAuth() ?
                                this.state.amazonId || true ? (
                                    <div>
                                        <Label>Message Vendeur Pré-Demande</Label>
                                        <div className='text-left mt-3'>
                                            {this.props.sellerNote}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        {/* Missing amazon linked case*/}
                                        <AnimatedError/>
                                        <p>Vous devez lier un compte Amazon pour demander à tester un produit.</p>
                                        <AmazonLoginButton onLogin={() => this.onAmazonLogin()}/>
                                    </div>
                                )
                                : (
                                    <div>
                                        {/* Logout case*/}
                                        <AnimatedError/>
                                        <p>Vous devez être connecté pour demander à tester un produit.</p>
                                        <Button color={'primary'} to={'/login'} tag={Link}>Se Connecter</Button>
                                        <Link to={'/register'}>Créer un compte</Link>
                                    </div>
                                )
                        }
                    </div>
                    <div className="modal-footer">
                        <Button
                            color="secondary"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => this.toggleModal()}
                        >
                            Fermer
                        </Button>
                        {
                            userServices.isAuth() && userServices.amazonId || true ? (
                                <Button color={'primary'} type='button' onClick={() => this.confirmRequest()}>
                                    Confirmer la Demande
                                </Button>
                            ) : null
                        }
                    </div>
                </Modal>
            </>
        );
    }
}

TestRequestModal.propTypes = {
    sellerNote: PropTypes.string.isRequired,
    productId: PropTypes.string.isRequired
};

export default TestRequestModal;