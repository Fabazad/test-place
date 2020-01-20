import React from "react";
// reactstrap components
import { Badge, UncontrolledTooltip } from "reactstrap";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import productServices from "../../services/product.service";
import {toast} from "react-toastify";

class UnpublishProductButton extends React.Component {

    _isMounted = true;

    removeProduct(productId) {
        if (window.confirm("Etes vous sûr de vouloir enlever la publication de votre annonce produit ?")) {
            productServices.update(productId, {published: false})
                .then(() => {
                    if (this._isMounted) {
                        this.props.onChange();
                    }
                    toast.success("Le produit n'est plus plublié");
                })
                .catch(() => toast.error("Une erreur est survenue lors de la récupération des produits."));
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const productId = this.props.productId;
        return (
            <>
                <Badge pill className="badge-circle w-100 h-100" onClick={() => this.removeProduct(productId)}
                       color={'danger'} tag={Link} to={'#'} id={"remove" + productId}>
                    <i className="fa fa-close m-auto fa-lg"/>
                </Badge>
                <UncontrolledTooltip delay={0} target={"remove" + productId}>Retirer</UncontrolledTooltip>
            </>
        );
    }
}

UnpublishProductButton.propTypes = {
    productId: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

export default UnpublishProductButton;