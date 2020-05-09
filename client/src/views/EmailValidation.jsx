import React from "react";

// reactstrap components
import {
  Card,
  CardBody,
  Container,
  Row,
  Col
} from "reactstrap";
import { Link } from "react-router-dom";

// core components
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import Loading from "components/Loading";
import userServices from "services/user.services";
import AnimatedCheck from "components/AnimatedCheck";
import AnimatedError from "components/AnimatedError";


class EmailValidation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loadingPromise: null,
      validate: null
    }
  }

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
    
    const loadingPromise = userServices.emailValidation(this.props.match.params.userId)
      .then(() => this.setState({validate: true}))
      .catch(() => this.setState({validate: false}));
    this.setState({loadingPromise});
  }

  render() {
    return (
      <>
        <main ref="main">
          <section className="section section-shaped section-lg">
            <div className="shape shape-style-1 bg-gradient-default">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <Container className="pt-lg-md">
              <Row className="justify-content-center">
                <Col lg="5">
                  <Card className="bg-secondary shadow border-0">
                    <CardBody className="px-lg-5 py-lg-5">
                      <Loading promise={this.state.loadigPromise} />
                      {this.state.validate === true ? 
                      <div className="text-center">
                        <AnimatedCheck/>
                        <p className="success">Email validée.</p>
                        <p className="text-center text-primary">
                          <Link to='/login'><small>Se connecter</small></Link>
                        </p>
                      </div> : null}
                      {this.state.validate === false ? 
                      <div className="text-center">
                        <AnimatedError text={'Email non validée.'} />
                      </div> : null}
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </section>
        </main>
        <SimpleFooter />
      </>
    );
  }
}

export default EmailValidation;
