import React from "react";
// reactstrap components
import {
    NavItem,
    NavLink,
    Nav,
    TabContent,
    TabPane
} from "reactstrap";
import Form from "reactstrap/es/Form";
import Input from "reactstrap/es/Input";
import Button from "reactstrap/es/Button";
import FormGroup from "reactstrap/es/FormGroup";
import Alert from "reactstrap/es/Alert";
import {toast} from "react-toastify";
import testServices from "../../services/test.services";
import PropTypes from "prop-types";

class AnswerTestRequestForm extends React.Component {

    constructor() {
        super();
        this.state = {
            tabs: 0,
            declineReason: '',
            sellerMessage: ''
        };
        this.declineRequest = this.declineRequest.bind(this);
        this.acceptRequest = this.acceptRequest.bind(this);
    }

    toggleNavs = (e, state, index) => {
        e.preventDefault();
        this.setState({
            [state]: index,
            declineReason: '',
            sellerMessage: ''
        });
    };

    declineRequest(e) {
        e.preventDefault();
        if (!this.state.declineReason) {
            toast.error("Veuillez donner une raison au refus de la demande")
        }
        testServices.declineTestRequest(this.props.testId, this.state.declineReason)
            .then(() => {
                this.props.onSubmit();
                toast.success("Demande de test refusée");
            });
    }

    acceptRequest(e) {
        e.preventDefault();
        testServices.acceptTestRequest(this.props.testId, this.state.sellerMessage)
            .then(() => {
                this.props.onSubmit();
                toast.success("Demande de test acceptée");
            });
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
                <div className="nav-wrapper">
                    <Nav className="nav-fill flex-column flex-md-row" id="tabs-icons-text" pills role="tablist">
                        <NavItem>
                            <NavLink
                                aria-selected={this.state.tabs === 1}
                                className={"mb-sm-3 mb-md-0 " + (this.state.tabs === 1 ? 'active bg-danger' : 'text-danger')}
                                onClick={e => this.toggleNavs(e, "tabs", 1)} href="#pablo" role="tab"
                            >
                                <i className="fa fa-hand-paper mr-2"/>
                                Refuser
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                aria-selected={this.state.tabs === 2}
                                className={"mb-sm-3 mb-md-0 " + (this.state.tabs === 2 ? 'active bg-success' : 'text-success')}
                                onClick={e => this.toggleNavs(e, "tabs", 2)} href="#pablo" role="tab"
                            >
                                <i className="fa fa-check mr-2"/>
                                Accepter
                            </NavLink>
                        </NavItem>
                    </Nav>
                </div>
                {this.state.tabs ?
                    <TabContent activeTab={"tabs" + this.state.tabs}>
                        <TabPane tabId="tabs1">
                            <Form className='mt-3' onSubmit={this.declineRequest}>
                                <FormGroup>
                                    <Input className="form-control-alternative" onChange={this.handleInputChange}
                                           placeholder="Expliquez la raison du refus..." rows="3" type="textarea"
                                           name='declineReason'/>
                                </FormGroup>
                                <Button color='danger' type='submit'>Refuser</Button>
                            </Form>
                        </TabPane>
                        <TabPane tabId="tabs2">
                            <Form className='mt-3' onSubmit={this.acceptRequest}>
                                <FormGroup>
                                    <Input className="form-control-alternative" onChange={this.handleInputChange}
                                           placeholder="Si besoin, donnez des indications au testeur pour la suite..."
                                           rows="3" type="textarea" name='sellerMessage'/>
                                </FormGroup>
                                <Alert color={'warning'} className='text-left'>
                                    <strong>Attention !</strong><br/>
                                    Le testeur aura accès au produit grâce à un lien qui lui sera fourni.<br/>
                                    Il est interdit de donner des indications sur comment retrouver le produit sur le
                                    site Amazon.<br/>
                                    La survie de Test-Place en dépend.
                                </Alert>
                                <Button color='success' type='submit'>Accepter</Button>
                            </Form>
                        </TabPane>
                    </TabContent> : null}
            </>
        );
    }
}

AnswerTestRequestForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    testId: PropTypes.string.isRequired
};

export default AnswerTestRequestForm;