import React from "react";
import userService from "../services/user.services";

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    Container,
    Row,
    Col
} from "reactstrap";
// core components
import UserHeader from "../components/Headers/UserHeader.jsx";
import Loading from "../components/Loading";
import UpdatePasswordModal from "../components/Modals/UpdatePasswordModal";
import {toast} from "react-toastify";
import AmazonLoginButton from "../components/Buttons/AmazonLoginButton";
import InfoPopover from "../components/InfoPopover";
import RolesSelectInput from "../components/Forms/RolesSelectInput";
import Label from "reactstrap/es/Label";
import constants from "../helpers/constants";
import {scrollTo} from "../helpers/scrollHelpers";

const {USER_ROLES} = constants;

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            testerMessage: "",
            sellerMessage: "",
            loading: false,
            roles: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({
            user: userService.currentUser,
            testerMessage: userService.currentUser.testerMessage,
            sellerMessage: userService.currentUser.sellerMessage,
            roles: userService.currentUser.roles
        });
        userService.currentUserSubject.subscribe(user => this.setState({user}));
    }

    handleInputChange = (event) => {
        const {value, name} = event.target;
        this.setState({
            [name]: value
        });
    };

    async handleSubmit(e) {
        e.preventDefault();
        this.setState({loading: true});

        if (this.state.roles.includes(USER_ROLES.TESTER) && !userService.getAmazonId()) {
            toast.error('Pour devenir Testeur, vous devez d\'abord lier votre compte Test-Place à un compte Amazon.');
            scrollTo('actions-section');
            this.setState({loading: false});
            return;
        }

        userService.updateUserInfo(userService.currentUser._id, {
            testerMessage: this.state.testerMessage,
            sellerMessage: this.state.sellerMessage,
            roles: this.state.roles
        })
            .catch(err => this.setState({loading: false}))
            .then(() => {
                this.setState({loading: false});
                toast.success("Modifications Enregistrées");
            });
    }

    render() {
        if (!this.state.user) {
            return (<Loading/>);
        }

        const {user} = this.state;

        const disabledSave = user.testerMessage === this.state.testerMessage
            && user.sellerMessage === this.state.sellerMessage
            && user.roles.join(',') === this.state.roles.join(',');

        return (
            <>
                <UserHeader/>
                {/* Page content */}
                <Container className="mt--7" fluid>
                    <Row>
                        <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
                            <Card className="card-profile shadow">
                                <Row className="justify-content-center">
                                    <Col className="order-lg-2" lg="3">
                                        <div className="card-profile-image">
                                            <a href="#pablo" onClick={e => e.preventDefault()}>
                                                <img
                                                    alt="..."
                                                    className="rounded-circle"
                                                    src={require("assets/img/theme/team-4-800x800.jpg")}
                                                />
                                            </a>
                                        </div>
                                    </Col>
                                </Row>
                                <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                                    <div className="d-flex justify-content-between">
                                        <Button className="float-right" color="default" href="#pablo"
                                                onClick={e => e.preventDefault()}
                                                size="sm">
                                            Message
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardBody className="pt-0 pt-md-4">
                                    <Row>
                                        <div className="col">
                                            <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                                                <div>
                                                    <span className="heading">22</span>
                                                    <span className="description">Friends</span>
                                                </div>
                                                <div>
                                                    <span className="heading">10</span>
                                                    <span className="description">Photos</span>
                                                </div>
                                                <div>
                                                    <span className="heading">89</span>
                                                    <span className="description">Comments</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Row>
                                    <div className="text-center">
                                        <h3>{user.name}</h3>
                                        <div className="h5 font-weight-300">
                                            <i className="ni location_pin mr-2"/>
                                            Bucharest, Romania
                                        </div>
                                        <div className="h5 mt-4">
                                            <i className="ni business_briefcase-24 mr-2"/>
                                            Solution Manager - Creative Tim Officer
                                        </div>
                                        <div>
                                            <i className="ni education_hat mr-2"/>
                                            University of Computer Science
                                        </div>
                                        <hr className="my-4"/>
                                        <p>
                                            Ryan — the name taken by Melbourne-raised, Brooklyn-based
                                            Nick Murphy — writes, performs and records all of his own
                                            music.
                                        </p>
                                        <a href="#pablo" onClick={e => e.preventDefault()}>
                                            Show more
                                        </a>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col className="order-xl-1" xl="8">
                            <Card className="bg-secondary shadow">
                                <CardHeader className="bg-white border-0">
                                    <Row className="align-items-center">
                                        <Col xs="8">
                                            <h3 className="mb-0">Mon Profil</h3>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <Form onSubmit={this.handleSubmit} className="position-relative">
                                        <Loading loading={this.state.loading}/>
                                        <div>
                                            <h6 className="heading-small text-muted mb-4 d-inline-block">
                                                Mes Informations
                                            </h6>
                                            <Button size="sm" color="info" className="float-right" type="submit"
                                                    disabled={disabledSave}>
                                                Enregister
                                            </Button>
                                        </div>
                                        <div className="pl-lg-4">
                                            <Row>
                                                <Col xs="12">
                                                    <FormGroup>
                                                        <Label className="form-control-label">Vous êtes ?</Label>
                                                        <RolesSelectInput defaultValue={userService.currentUser.roles}
                                                                          onChange={this.handleInputChange}
                                                                          name="roles"/>
                                                    </FormGroup>
                                                </Col>
                                                <Col xs="12">
                                                    <FormGroup>
                                                        <label className="form-control-label"
                                                               htmlFor="input-tester-message">
                                                            Message Testeur
                                                            <InfoPopover className="ml-3">
                                                                Le champ texte <b><i>Message au Vendeur</i></b> à
                                                                fournir lors
                                                                d'une demande de test sera pré-rempli avec ce <b><i>Message
                                                                Testeur</i></b>.
                                                            </InfoPopover>
                                                        </label>
                                                        <Input className="form-control-alternative"
                                                               defaultValue={user.testerMessage}
                                                               id="input-tester-message"
                                                               placeholder={"Bonjour, je suis " + user.name + "..."}
                                                               type="textarea" name="testerMessage"
                                                               onChange={this.handleInputChange}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col xs="12">
                                                    <FormGroup>
                                                        <label className="form-control-label"
                                                               htmlFor="input-seller-message">
                                                            Message Vendeur
                                                            <InfoPopover className="ml-3">
                                                                <b>Message Vendeur</b> sera utilisé comme message par
                                                                défault lorsque vous <b>accepterez des demandes de
                                                                test</b>.<br/>
                                                                C'est aussi le message que recevront vos testeurs
                                                                lorsqu'ils passeront par l'<b>acceptaion
                                                                automatique</b> des demandes (<i
                                                                className="fa fa-bolt text-yellow"/>).
                                                            </InfoPopover>
                                                        </label>
                                                        <Input className="form-control-alternative"
                                                               defaultValue={user.sellerMessage}
                                                               id="input-seller-message"
                                                               placeholder={"Merci d'avoir choisi notre produit, ..."}
                                                               type="textarea" name="sellerMessage"
                                                               onChange={this.handleInputChange}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Form>
                                    <hr className="my-4" id='actions-section'/>
                                    {/* Actions */}
                                    <h6 className="heading-small text-muted mb-4">
                                        Actions
                                    </h6>
                                    <div className="pl-lg-4">
                                        <Row>
                                            <Col md="6">
                                                <FormGroup className="text-center">
                                                    <UpdatePasswordModal/>
                                                </FormGroup>
                                            </Col>
                                            <Col md="6">
                                                <FormGroup className="text-center">
                                                    <AmazonLoginButton/>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </div>
                                    <hr className="my-4"/>
                                    {/* Description */}
                                    <h6 className="heading-small text-muted mb-4">About me</h6>
                                    <div className="pl-lg-4">
                                        <FormGroup>
                                            <label>About Me</label>
                                            <Input
                                                className="form-control-alternative"
                                                placeholder="A few words about you ..."
                                                rows="4"
                                                defaultValue="A beautiful Dashboard for Bootstrap 4. It is Free and
                          Open Source."
                                                type="textarea"
                                            />
                                        </FormGroup>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default Profile;
