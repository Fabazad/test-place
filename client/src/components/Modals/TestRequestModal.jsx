import React from "react";
// reactstrap components
import {
    Button,
    Modal,
    Label,
    FormGroup,
    Input
} from "reactstrap";
import userServices from '../../services/user.services';
import testServices from '../../services/test.services';
import AmazonLoginButton from "../Buttons/AmazonLoginButton";
import {Link} from "react-router-dom";
import AnimatedError from "../AnimatedError";
import PropTypes from "prop-types";
import {toast} from "react-toastify";
import AnimatedCheck from "../AnimatedCheck";

class TestRequestModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            amazonId: null,
            testerMessage: "",
            requestSent: false
        }
    }

    componentDidMount() {
        const currentUser = userServices.currentUser;

        if (currentUser) {
            this.setState({
                amazonId: currentUser.amazonId,
                testerMessage: currentUser.testerMessage
            });
        }
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen,
            testerMessage: userServices.currentUser.testerMessage,
            requestSent: false
        });
    }

    onAmazonLogin() {
        this.setState({amazonId: userServices.amazonId});
    }

    async confirmRequest() {
        await testServices.create({
            product: this.props.productId,
            testerMessage: this.state.testerMessage
        });
        this.setState({ requestSent: true });
    }

    handleInputChange = (event) => {
        const {value, name} = event.target;
        this.setState({
            [name]: value
        });
    };

    render() {
        return (
            <>
                {/* Button trigger modal */}
                <Button className='mt-3 w-100' color="primary" type="button" size={'lg'}
                        onClick={() => this.toggleModal()}>
                    Demander à Tester
                </Button>
                {/* Modal */}
                <Modal className="modal-dialog-centered" isOpen={this.state.isModalOpen}
                       toggle={() => this.toggleModal()}>
                    <div className="modal-header">
                        <h2 className="modal-title">Demande de Test</h2>
                        <button aria-label="Close" className="close" data-dismiss="modal" type="button"
                                onClick={() => this.toggleModal()}>
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body text-center">
                        {this.state.requestSent ? (
                            <div>
                                <AnimatedCheck />
                                <p className="mt-5 h4">
                                    Votre demande de test a bien été envoyée.<br/>
                                    Il ne vous reste plus qu'à attendre la réponse du vendeur.<br/><br/>
                                    Vous pouvez l'état de votre demande sur votre page<br/>
                                    <Link to="/dashboard/sent-requests">Mes Demandes Envoyées</Link>
                                </p>
                            </div>
                        ) : (
                            <>
                                {userServices.isAuth() ?
                                    //TODO remove true
                                    this.state.amazonId || true ? (
                                        <FormGroup className="text-left">
                                            {/* It's all good case */}
                                            <Label for="sellerMessage">Message au Vendeur</Label>
                                            <Input className="form-control-alternative" id="testerMessage"
                                                   defaultValue={this.state.testerMessage}
                                                   placeholder="Je serai très fier de tester votre produit..."
                                                   type="textarea" name="testerMessage"
                                                   onChange={this.handleInputChange}/>
                                        </FormGroup>
                                    ) : (
                                        <div>
                                            {/* Missing amazon link case*/}
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
                                            <Link to={'/register'} className="ml-3">Créer un compte</Link>
                                        </div>
                                    )}
                            </>
                        )}

                    </div>
                    <div className="modal-footer">
                        <Button color="secondary" data-dismiss="modal" type="button" onClick={() => this.toggleModal()}>
                            Fermer
                        </Button>
                        {userServices.isAuth() && userServices.amazonId && !this.state.requestSent || true ? (
                            //TODO remove true
                            <Button color={'primary'} type='button' onClick={() => this.confirmRequest()}>
                                Confirmer la Demande
                            </Button>
                        ) : null}
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