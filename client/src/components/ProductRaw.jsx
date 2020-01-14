import React from "react";

// reactstrap components
import {
    Badge, UncontrolledTooltip, Media
} from "reactstrap";
import PropTypes from "prop-types";
import {textSlice, formatDate} from '../helpers/textHelpers';
import {Link} from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
import productServices from '../services/product.service';
import {toast} from "react-toastify";

class ProductRaw extends React.Component {

    removeProduct(productId) {
        if (window.confirm("Etes vous sûr de vouloir enlever la publication de votre annonce produit ?")) {
            productServices.update(productId, {published: false})
                .then(() => {
                    this.props.onChange();
                    toast.success("Le produit n'est plus plublié");
                })
                .catch(() => toast.error("Une erreur est survenue lors de la récupération des produits."));
        }
    }

    publishProduct(productId) {
        if (window.confirm("Etes vous sûr de vouloir publier votre annonce produit ?")) {
            productServices.update(productId, {published: true})
                .then(() => {
                    this.props.onChange();
                    toast.success("Le produit a été plublié");
                })
                .catch(() => toast.error("Une erreur est survenue lors de la récupération des produits."));
        }
    }

    render() {
        const {product} = this.props;
        if (this.props.loading) {
            return (
                <tr className={"w-100"}>
                    <th scope={'row'}>
                        <div style={{'height': '48px'}} className={"d-flex w-100 align-items-center"}>
                            <div className={"w-100"}>
                                <Skeleton/>
                            </div>
                        </div>
                    </th>
                    <th scope={'row'}>
                        <div style={{'height': '48px'}} className={"d-flex w-100 align-items-center"}>
                            <div className={"w-100"}>
                                <Skeleton/>
                            </div>
                        </div>
                    </th>
                    <th scope={'row'}>
                        <div style={{'height': '48px'}} className={"d-flex w-100 align-items-center"}>
                            <div className={"w-100"}>
                                <Skeleton/>
                            </div>
                        </div>
                    </th>
                    <th scope={'row'}>
                        <div style={{'height': '48px'}} className={"d-flex w-100 align-items-center"}>
                            <div className={"w-100"}>
                                <Skeleton/>
                            </div>
                        </div>
                    </th>
                    <th scope={'row'}>
                        <div style={{'height': '48px'}} className={"d-flex w-100 align-items-center"}>
                            <div className={"w-100"}>
                                <Skeleton/>
                            </div>
                        </div>
                    </th>
                    <th scope={'row'}>
                        <div style={{'height': '48px'}} className={"d-flex w-100 align-items-center"}>
                            <div className={"w-100"}>
                                <Skeleton/>
                            </div>
                        </div>
                    </th>
                </tr>
            )
        }
        return (
            <tr>
                <th scope="row">
                    <Media className="align-items-center">
                        <a className="avatar rounded-circle mr-3 bg-transparent" href="#pablo" onClick={e => e.preventDefault()} >
                            <img className='shadow' alt="..."
                                 src={product.imageUrls[0].replace(/^(.+)(\.jpg)/, "$1._SS40_$2")}
                            />
                        </a>
                        <Media>
                            <span className="mb-0 text-sm">
                                {textSlice(product.title, 25)}
                            </span>
                        </Media>
                    </Media>
                </th>
                <th>
                    <h3><Badge color={'primary'}>{product.price}€</Badge></h3>
                </th>
                <th>
                    <h3>
                        <Badge color={product.finalPrice > 0 ? 'warning' : 'success'}>{product.finalPrice}€</Badge>
                    </h3>
                </th>
                <th>
                    {
                        product.published ? (
                            <>
                                <Badge color={'success'}
                                       className={'badge-circle badge-lg text-center p-0'}
                                       pill>
                                    <i className="ni ni-check-bold m-auto"/>
                                </Badge>
                                <span
                                    className="ml-2 text-muted">{formatDate(product.publishDate)}</span>
                            </>
                        ) : (
                            <Badge color={'danger'}
                                   className={'badge-circle badge-lg text-center p-0'}
                                   pill>
                                <i className="ni ni-fat-remove m-auto ni-lg"/>
                            </Badge>
                        )
                    }
                </th>
                <td>0 / {product.maxDemands}</td>
                <td>
                    <div className="avatar-group">
                        {product.published ? (
                            <div className="cursor-pointer avatar avatar-sm bg-transparent">
                                <Badge pill className="badge-circle w-100 h-100"
                                       onClick={() => this.removeProduct(product._id)}
                                       color={'danger'}
                                       tag={Link} to={'#'} id={"remove" + product._id}>
                                    <i className="fa fa-close m-auto fa-lg"/>
                                </Badge>
                                <UncontrolledTooltip
                                    delay={0}
                                    target={"remove" + product._id}
                                >Retirer</UncontrolledTooltip>
                            </div>
                        ) : (
                            <>
                                <div className="cursor-pointer avatar avatar-sm bg-transparent">
                                    <Badge pill className="badge-circle w-100 h-100"
                                           color={'danger'}
                                           tag={Link} to={'#'} id={"delete" + product._id}>
                                        <i className="fa fa-trash m-auto fa-lg"/>
                                    </Badge>
                                    <UncontrolledTooltip
                                        delay={0}
                                        target={"delete" + product._id}
                                    >Supprimer</UncontrolledTooltip>
                                </div>
                                < div className="cursor-pointer avatar avatar-sm bg-transparent">
                                    <Badge pill className="badge-circle w-100 h-100"
                                           onClick={() => this.publishProduct(product._id)}
                                           color={'success'}
                                           tag={Link} to={'#'} id={"publish" + product._id}>
                                        <i className="fa fa-globe m-auto fa-lg"/>
                                    </Badge>
                                    <UncontrolledTooltip
                                        delay={0}
                                        target={"publish" + product._id}
                                    >Publier</UncontrolledTooltip>
                                </div>
                            </>
                        )}
                        <div className="cursor-pointer avatar avatar-sm bg-transparent">
                            < Badge pill
                                    className="badge-circle w-100 h-100"
                                    color={'warning'}
                                    tag={Link} to={'#'} id={"edit" + product._id}>
                                <i className="fa fa-edit m-auto fa-lg"/>
                            </Badge>
                            <UncontrolledTooltip
                                delay={0}
                                target={"edit" + product._id}
                            >Editer</UncontrolledTooltip>
                        </div>
                        {product.published ? (
                            <div className="cursor-pointer avatar avatar-sm bg-transparent">
                                <Badge pill
                                       className="badge-circle w-100 h-100"
                                       color={'info'}
                                       tag={Link} to={'/ad/' + product._id}
                                       id={"see" + product._id}>
                                    <i className="fa fa-eye m-auto fa-lg"/>
                                </Badge>
                                <UncontrolledTooltip
                                    delay={0}
                                    target={"see" + product._id}
                                >Voir</UncontrolledTooltip>
                            </div>
                        ) : null}
                        <div className="cursor-pointer avatar avatar-sm bg-transparent">
                            <Badge pill
                                   className="badge-circle w-100 h-100"
                                   color={'primary'}
                                   tag={Link} to={'#'} id={"upgrade" + product._id}>
                                <i className="fa fa-diamond m-auto fa-lg"/>
                            </Badge>
                            <UncontrolledTooltip
                                delay={0}
                                target={"upgrade" + product._id}
                            >
                                Upgrade
                            </UncontrolledTooltip>
                        </div>
                    </div>
                </td>
            </tr>
        );
    }
}

ProductRaw.propTypes = {
    product: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
};

export default ProductRaw;