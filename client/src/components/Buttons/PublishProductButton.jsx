import React from "react";
// reactstrap components
import { Badge, UncontrolledTooltip } from "reactstrap";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import productServices from "../../services/product.service";
import {toast} from "react-toastify";

class PublishProductButton extends React.Component {

    _isMounted = true;

    publishProduct(productId) {
        if (window.confirm("Etes vous sûr de vouloir publier votre annonce produit ? Elle sera publiée pour un mois de plus maximum.")) {
            productServices.update(productId, {published: true})
                .then(() => {
                    if (this._isMounted) {
                        productServices.productsUpdatedSubject.next();
                    }
                    toast.success("Le produit a été plublié");
                })
                .catch(() => toast.error("Une erreur est survenue lors de la publication du produit."));
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const productId = this.props.productId;
        return (
            <>
                <Badge pill className="badge-circle w-100 h-100"
                       onClick={() => this.publishProduct(productId)}
                       color={'success'}
                       tag={Link} to={'#'} id={"publish" + productId}>
                    <i className="fa fa-globe m-auto fa-lg"/>
                </Badge>
                <UncontrolledTooltip delay={0} target={"publish" + productId}>Publier</UncontrolledTooltip>
            </>
        );
    }
}

PublishProductButton.propTypes = {
    productId: PropTypes.string.isRequired
};

export default PublishProductButton;