import React from "react";
// reactstrap components
import PropTypes from "prop-types";
import productServices from "../../services/product.service";
import {toast} from "react-toastify";
import confirmHelper from "../../helpers/confirmHelper";
import RowActionButton from "./RowActionButton";

const DeleteProductButton = props => {

    const {productId} = props;

    const deleteProduct = () => {
        confirmHelper.confirm("Etes vous sûr de vouloir supprimer votre produit ?", () => {
            productServices.delete(productId)
                .then(() => {
                    productServices.productsUpdatedSubject.next();
                    toast.success("Le produit a été supprimé");
                });
        });
    };

    return <RowActionButton title="Supprimer" icon="fa fa-trash" color="danger" onClick={deleteProduct}/>;
};

DeleteProductButton.propTypes = {
    productId: PropTypes.string.isRequired
};

export default DeleteProductButton;