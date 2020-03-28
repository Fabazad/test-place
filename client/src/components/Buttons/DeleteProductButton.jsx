import React from "react";
// reactstrap components
import {Badge, Button, UncontrolledTooltip} from "reactstrap";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import productServices from "../../services/product.service";
import {toast} from "react-toastify";

class DeleteProductButton extends React.Component {

    _isMounted = true;

    deleteProduct(productId) {
        if (window.confirm("Etes vous sûr de vouloir supprimer votre produit ?")) {
            productServices.delete(productId)
                .then(() => {
                    if (this._isMounted) {
                        productServices.productsUpdatedSubject.next();
                    }
                    toast.success("Le produit a été supprimé");
                })
                .catch(() => toast.error("Une erreur est survenue lors de la suppression du produit."));
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const productId = this.props.productId;
        return (
            <>
                <Button color="danger" className="d-block d-lg-none w-100 text-center mx-0 my-1"
                        onClick={() => this.deleteProduct(productId)}>
                    <i className="fa fa-trash m-auto fa-lg"/>
                    <span className="ml-2">Supprimer</span>
                </Button>
                <div className="cursor-pointer avatar avatar-sm bg-transparent d-none d-lg-inline-block">
                    <Badge pill className="badge-circle w-100 h-100" color={'danger'}
                           tag={Link} to={'#'} id={"delete" + productId} onClick={() => this.deleteProduct(productId)}>
                        <i className="fa fa-trash m-auto fa-lg"/>
                    </Badge>
                    <UncontrolledTooltip delay={0} target={"delete" + productId}>Supprimer</UncontrolledTooltip>
                </div>
            </>
        );
    }
}

DeleteProductButton.propTypes = {
    productId: PropTypes.string.isRequired
};

export default DeleteProductButton;