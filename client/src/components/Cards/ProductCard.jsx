import React from "react";

// reactstrap components
import {
    CardBody, Badge, Card, Row, UncontrolledTooltip
} from "reactstrap";
import PropTypes from "prop-types";
import {textSlice, formatDate} from '../../helpers/textHelpers';
import constants from "../../helpers/constants";
import Loading from "../Loading";
import {Link} from "react-router-dom";

class ProductCard extends React.Component {

    componentDidMount() {
    }

    render() {
        const {product} = this.props;
        return (
            <Card className={"card-lift--hover shadow border-0 cursor-pointer"}
                  to={(product ? 'ad/' + product._id : '#')} tag={Link}>
                <CardBody>
                    <Loading loading={!product}/>
                    <div style={{'height': '200px'}} className={"text-center"}>
                        <img src={product ? product.imageUrls[0] : constants.BASE_PRODUCT_PICTURE_URL} alt=""
                             className={"mw-100 shadow-lg rounded"}
                             style={{'maxHeight': '200px'}}/>
                    </div>
                    <div style={{height: '58px'}}>
                        <h5 className="text-primary mt-4">
                            {product ? textSlice(product.title, 80) : ''}
                        </h5>
                    </div>
                    <Row className='mt-3'>
                        <div className="col-6 text-center">
                            <small>Prix Amazon</small>
                            <h1>
                                <Badge color="primary" pill className={'badge-xl'}>
                                    {product ? product.price : ' '} €
                                </Badge>
                            </h1>
                        </div>
                        <div className="col-6 text-center">
                            <small>Coût Final</small>
                            <h1>
                                <Badge color={product && product.finalPrice > 0 ? "warning" : "success"} pill
                                       size={'xl'}>
                                    {product ? product.finalPrice : ' '} €
                                </Badge>
                            </h1>
                        </div>
                    </Row>
                    <div className="text-center mt-3" style={{'height': '30px'}}>
                        {
                            product && product.isPrime ? (
                                <Badge color="info" pill className="mr-1 badge-lg">
                                    <img src={require("assets/img/icons/prime.png")} alt="prime"
                                         style={{"height": "11px"}}/>
                                </Badge>
                            ) : null
                        }
                        {
                            product && product.automaticAcceptance ? (
                                <>
                                    <Badge color="info" pill className="mr-1 badge-lg"
                                           id={"automaticAcceptance" + product._id}>
                                        Automatique
                                    </Badge>
                                    <UncontrolledTooltip
                                        delay={0}
                                        placement="top"
                                        target={"automaticAcceptance" + product._id}
                                    >
                                        Acceptation Automatique
                                    </UncontrolledTooltip>
                                </>
                            ) : null
                        }

                    </div>
                    <div className="mt-3">
                        <small className="text-muted">{product ? formatDate(product.createdAt) : '  /  /  '}</small>
                    </div>
                </CardBody>
            </Card>
        );
    }
}

ProductCard.propTypes = {
    product: PropTypes.object
};

export default ProductCard;