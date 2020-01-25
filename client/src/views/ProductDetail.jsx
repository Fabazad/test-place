import React from "react";

// reactstrap components
import {
    Container, Row, Badge, Card, CardBody, Label
} from "reactstrap";

// core components
import SimpleFooter from "../components/Footers/SimpleFooter.jsx";
import productServices from '../services/product.service';
import userServices from '../services/user.services';
import constants from "../helpers/constants";
import {Link} from "react-router-dom";
import {formatDate} from "../helpers/textHelpers";
import Carousel from "../components/Carousel";
import TestRequestModal from "../components/Modals/TestRequestModal";

class ProductDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            product: undefined,
            categories: []
        };
    }

    componentDidMount() {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        this.refs.main.scrollTop = 0;

        const {productId} = this.props.match.params;
        productServices.getOne(productId).then(product => this.setState({product}));
        productServices.getProductCategories().then(categories => this.setState({categories}));
    }

    getProduct(productValue) {
        const product = this.state.categories.find(category => category.value === productValue);
        if (product) {
            return product.text;
        }
        return null;
    }

    render() {
        const {product} = this.state;
        const currentUserId = userServices.getCurrentUserId();
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
                                    {
                                        product ? (
                                            <Carousel imageUrls={product.imageUrls}/>
                                        ) : (
                                            <img src={constants.BASE_PRODUCT_PICTURE_URL}
                                                 alt="product base" className="rounded shadow w-100"/>
                                        )
                                    }
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
                                                <Badge pill className='badge-lg bg-secondary shadow'
                                                       color={product && product.finalPrice === 0 ? 'success' : 'warning'}>
                                                    {product ? product.finalPrice : ''} €
                                                </Badge>
                                            </h1>
                                        </div>
                                        {/* Desktop view */}
                                        {product && product._id && currentUserId !== product.seller._id ? (
                                            <div className={"d-none d-md-block"}>
                                                <TestRequestModal sellerNote={product.beforeNote} productId={product._id}/>
                                            </div>
                                        ) : null}
                                    </div>
                                    {/* Mobile view */}
                                    {product && product._id ? (
                                        <div className={"d-block d-md-none"}>
                                            <TestRequestModal sellerNote={product.beforeNote} productId={product._id}/>
                                        </div>
                                    ) : null}
                                    <div className="mt-5">
                                        <Label>
                                            Catégorie : {product ? this.getProduct(product.category) : null}
                                        </Label>
                                    </div>
                                    <div className="mt-2">
                                        <h1>{product ? product.title : ''}</h1>
                                    </div>
                                    <div className="mt-4 d-flex justify-content-around">
                                        {
                                            product && product.automaticAcceptance ? (
                                                <h2 className="d-inline-block">
                                                    <Badge pill color={'info'} className='badge-lg'>
                                                        Acceptation Automatique
                                                    </Badge>
                                                </h2>
                                            ) : null
                                        }

                                        {
                                            product && product.isPrime ? (
                                                <h2 className="d-inline-block">
                                                    <Badge pill color={'info'} className='badge-lg'>
                                                        <img src={require("assets/img/icons/prime.png")} alt="prime"
                                                             style={{"height": "18px"}}/>
                                                    </Badge>
                                                </h2>
                                            ) : null
                                        }

                                    </div>
                                    <div className="mt-3">
                                        <Card>
                                            <CardBody>
                                                <h2 className="text-center">Vendeur</h2>
                                                <Row>
                                                    <div className="col text-center">
                                                        <Label className='d-block'>Test Place</Label>
                                                        {product ? (
                                                            <Link to={'#'}>{product.seller.name}</Link>
                                                        ) : null}
                                                    </div>
                                                    {product && product.amazonSeller ? (
                                                        <div className="col-6 text-center">
                                                            <Label className='d-block'>Amazon</Label>
                                                            <a href={product.amazonSeller.url} target='_blank'
                                                               rel="noopener noreferrer">
                                                                {product.amazonSeller.name}
                                                            </a>
                                                        </div>
                                                    ) : null}
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </div>
                                </div>
                            </Row>
                            <Row>
                                <div className="col-12 mt-5">
                                    <h2>Description Produit</h2>
                                    <p className="text-left">
                                        <small
                                            style={{whiteSpace: 'pre-line'}}>{product ? product.description : ''}</small>
                                    </p>
                                    {
                                        product && product.asin ? (
                                            <p>Plus de détails sur la{' '}
                                                <a href={'https://www.amazon.fr/dp/' + product.asin} target='_blank'
                                                   rel="noopener noreferrer">Page Amazon du Produit</a>
                                            </p>
                                        ) : null
                                    }
                                    <Badge color={'primary'} pill className='badge-lg'>
                                        Publication : {product ? formatDate(product.createdAt) : ''}
                                    </Badge>
                                </div>
                            </Row>
                        </Container>
                    </section>
                </main>
                <SimpleFooter/>
            </>
        );
    }
}

export default ProductDetail;
