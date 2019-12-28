import React from "react";

// reactstrap components
import {
    Container, Row, Button, Badge, Card, CardBody
} from "reactstrap";

// core components
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import productServices from '../services/product.service';
import constants from "../helpers/constants";

class ProductDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            product: undefined
        };
    }

    componentDidMount() {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        this.refs.main.scrollTop = 0;

        const {productId} = this.props.match.params;
        productServices.getOne(productId).then(product => this.setState({product}));
    }

    render() {
        const {product} = this.state;
        console.log(product ? product.description : undefined);
        return (
            <>
                <main ref="main">
                    <section className="section section-shaped section-lg">
                        <div className="shape shape-style-1 bg-gradient-default">
                            <span/>
                            <span/>
                            <span/>
                            <span/>
                            <span/>
                            <span/>
                            <span/>
                            <span/>
                        </div>
                        <Container className="pt-lg-md mb-5">
                            <img src="" alt=""/>
                        </Container>
                        <div className="separator separator-bottom separator-skew">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                preserveAspectRatio="none"
                                version="1.1"
                                viewBox="0 0 2560 100"
                                x="0"
                                y="0"
                                className={"w-100"}
                            >
                                <polygon
                                    className="fill-secondary"
                                    points="2560 0 2560 100 0 100"
                                />
                            </svg>
                        </div>
                    </section>
                    <section className="section section-lg pt-0 mt--100">
                        <Container>
                            <Row>
                                <div className="col-12 col-md-6">
                                    <img src={product ? product.pictureUrl : constants.BASE_PRODUCT_PICTURE_URL}
                                         alt="product image" className="rounded shadow w-100"/>
                                </div>
                                <div className="col-12 col-md-6 mt-3 mt-md-0">
                                    <div className="text-center mt-4 d-flex justify-content-around">
                                        <div>
                                            <small className="text-muted d-block mb-1">Prix Initial</small>
                                            <h1 className="d-inline-block">
                                                <Badge pill color={'primary'} className='badge-lg bg-secondary shadow'>
                                                    {product ? product.price : ''} €
                                                </Badge>
                                            </h1>
                                        </div>
                                        <div>
                                            <small className='text-muted d-block mb-1'>Coût Final</small>
                                            <h1 className="d-inline-block">
                                                <Badge pill
                                                       color={product && product.finalPrice === 0 ? 'success' : 'warning'}
                                                       className='badge-lg bg-secondary shadow'>
                                                    {product ? product.finalPrice : ''} €
                                                </Badge>
                                            </h1>
                                        </div>
                                        <div>
                                            <Button color={'primary'} className="btn-lg mt-3">Demander à Tester</Button>
                                        </div>
                                    </div>
                                    <div className="mt-5">
                                        <h1>{product ? product.title : ''}</h1>
                                    </div>
                                    <div className="mt-4 d-flex justify-content-around">
                                        {
                                            product && product.automaticAcceptance ? (
                                                <h1 className="d-inline-block">
                                                    <Badge pill color={'info'} className='badge-lg'>
                                                        Acceptation Automatique
                                                    </Badge>
                                                </h1>
                                            ) : null
                                        }

                                        {
                                            product && product.isPrime ? (
                                                <h1 className="d-inline-block">
                                                    <Badge pill color={'info'} className='badge-lg'>
                                                        <img src={require("assets/img/icons/prime.png")} alt="prime"
                                                             style={{"height": "18px"}}/>
                                                    </Badge>
                                                </h1>
                                            ) : null
                                        }

                                    </div>
                                    <div className="mt-3">
                                        <Card>
                                            <CardBody>
                                                <h2 className="text-center">Vendeur</h2>
                                            </CardBody>
                                        </Card>
                                    </div>
                                </div>
                            </Row>
                            <Row>
                                <div className="col-12">
                                    <p className="text-left">
                                        <small
                                            style={{whiteSpace: 'pre-line'}}>{product ? product.description : ''}</small>
                                    </p>
                                </div>
                            </Row>

                        </Container>
                    </section>
                    <section>
                        <Container>

                        </Container>
                    </section>
                </main>
                <SimpleFooter/>
            </>
        );
    }
}

export default ProductDetail;
