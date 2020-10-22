import React from "react";
// reactstrap components
import PropTypes from "prop-types";
import productServices from "../../services/product.service";
import {toast} from "react-toastify";
import confirmHelper from "../../helpers/confirmHelper";
import RowActionButton from "./RowActionButton";
import {withTranslation} from "react-i18next";

const UnpublishProductButton = props => {

    const {productId, t} = props;

    const unpublishProduct = () => {
        confirmHelper.confirm(t("CONFIRM_PUBLISH"), () => {
            productServices.update(productId, {published: false})
                .then(() => {
                    productServices.productsUpdatedSubject.next();
                    toast.success(t("PRODUCT_UNPUBLISHED"));
                })
                .catch(() => toast.error(t("ISSUE_WHILE_UNPUBLISHING")));
        });
    };

    return <RowActionButton title={t("UNPUBLISH")} icon="fa fa-globe" color="danger" onClick={unpublishProduct}/>;
};

UnpublishProductButton.propTypes = {
    productId: PropTypes.string.isRequired
};

export default withTranslation()(UnpublishProductButton);