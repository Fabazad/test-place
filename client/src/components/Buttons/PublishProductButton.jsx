import React from "react";
// reactstrap components
import PropTypes from "prop-types";
import productServices from "../../services/product.service";
import {toast} from "react-toastify";
import confirmHelper from "../../helpers/confirmHelper";
import RowActionButton from "./RowActionButton";

const PublishProductButton = props => {

    const {productId} = props;

    const publishProduct = () => {
        confirmHelper.confirm("Etes vous sûr de vouloir publier votre annonce produit ? Elle sera publiée pour un mois de plus maximum.", () => {
            productServices.update(productId, {published: true})
                .then(() => {
                    productServices.productsUpdatedSubject.next();
                    toast.success("Le produit a été plublié");
                })
                .catch(() => toast.error("Une erreur est survenue lors de la publication du produit."));
        });
    };

    return <RowActionButton title="Publier" icon="fa fa-globe" color="success" onClick={publishProduct}/>;
};

PublishProductButton.propTypes = {
    productId: PropTypes.string.isRequired
};

export default PublishProductButton;