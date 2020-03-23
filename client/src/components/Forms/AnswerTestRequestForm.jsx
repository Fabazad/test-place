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
import warning from "react-redux/lib/utils/warning";

class AnswerTestRequestForm extends React.Component {
    state = {
        tabs: 0
    };
    toggleNavs = (e, state, index) => {
        e.preventDefault();
        this.setState({
            [state]: index
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
                            <Form className='mt-3'>
                                <FormGroup>
                                    <Input className="form-control-alternative"
                                           placeholder="Expliquez la raison du refus..." rows="3" type="textarea"/>
                                </FormGroup>
                                <Button color='danger'>Refuser</Button>
                            </Form>
                        </TabPane>
                        <TabPane tabId="tabs2">
                            <Form className='mt-3'>
                                <FormGroup>
                                    <Input className="form-control-alternative"
                                           placeholder="Si besoin, donnez des indications au testeur pour la suite..."
                                           rows="3" type="textarea"/>
                                </FormGroup>
                                <Alert color={'warning'} className='text-left'>
                                    <strong>Attention !</strong><br/>
                                    Le testeur aura accès au produit grâce à un lien qui lui sera fourni.<br/>
                                    Il est interdit de donner des indications sur comment retrouver le produit sur le
                                    site Amazon.<br/>
                                    La survie de Test-Place en dépend.
                                </Alert>
                                <Button color='success'>Accepter</Button>
                            </Form>
                        </TabPane>
                    </TabContent> : null}
            </>
        );
    }
}

export default AnswerTestRequestForm;