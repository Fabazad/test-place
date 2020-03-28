import React from "react";
// reactstrap components
import {Badge, UncontrolledTooltip, Button} from "reactstrap";
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
                        productServices.productsUpdatedSubject.next();
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
                <div className="cursor-pointer avatar avatar-sm bg-transparent d-none d-lg-inline-block">
                    <Badge pill className="badge-circle w-100 h-100" onClick={() => this.removeProduct(productId)}
                           color={'danger'} tag={Link} to={''} id={"remove" + productId}>
                        <i className="fa fa-times m-auto fa-lg"/>
                    </Badge>
                    <UncontrolledTooltip delay={0} target={"remove" + productId}>Retirer</UncontrolledTooltip>
                </div>
                <Button color="danger" onClick={() => this.removeProduct(productId)}
                        className="d-block d-lg-none w-100 text-center mx-0 my-1">
                    <i className="fa fa-times m-auto fa-lg"/>
                    <span className="ml-2">Retirer</span>
                </Button>
            </>
        );
    }
}

UnpublishProductButton.propTypes = {
    productId: PropTypes.string.isRequired
};

export default UnpublishProductButton;