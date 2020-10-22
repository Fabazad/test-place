import React from "react";
// reactstrap components
import PropTypes from "prop-types";
import productServices from "../../services/product.service";
import {toast} from "react-toastify";
import confirmHelper from "../../helpers/confirmHelper";
import RowActionButton from "./RowActionButton";
import {withTranslation} from "react-i18next";

const DeleteProductButton = props => {

    const {productId, t} = props;

    const deleteProduct = () => {
        confirmHelper.confirm(t("CONFIRM_DELETE_PRODUCT"), () => {
            productServices.delete(productId)
                .then(() => {
                    productServices.productsUpdatedSubject.next();
                    toast.success(t("PRODUCT_DELETED"));
                });
        });
    };

    return <RowActionButton title={t("DELETE")} icon="fa fa-trash" color="danger" onClick={deleteProduct}/>;
};

DeleteProductButton.propTypes = {
    productId: PropTypes.string.isRequired
};

export default withTranslation()(DeleteProductButton);