import React from "react";
// reactstrap components
import PropTypes from "prop-types";
import productServices from "../../services/product.service";
import {toast} from "react-toastify";
import confirmHelper from "../../helpers/confirmHelper";
import RowActionButton from "./RowActionButton";

const UnpublishProductButton = props => {

    const {productId} = props;

    const unpublishProduct = () => {
        confirmHelper.confirm("Etes vous sûr de vouloir enlever la publication de votre annonce produit ?", () => {
            productServices.update(productId, {published: false})
                .then(() => {
                    productServices.productsUpdatedSubject.next();
                    toast.success("Le produit n'est plus plublié");
                })
                .catch(() => toast.error("Une erreur est survenue lors de la récupération des produits."));
        });
    };

    return <RowActionButton title="Retirer" icon="fa fa-times" color="danger" onClick={unpublishProduct}/>;
};

UnpublishProductButton.propTypes = {
    productId: PropTypes.string.isRequired
};

export default UnpublishProductButton;