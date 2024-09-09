import React from "react";
// reactstrap components
import PropTypes from "prop-types";
import productServices from "../../services/product.service";
import { toast } from "react-toastify";
import confirmHelper from "../../helpers/confirmHelper";
import RowActionButton from "./RowActionButton";
import { withTranslation } from "react-i18next";

const PublishProductButton = (props) => {
  const { productId, t } = props;

  const publishProduct = () => {
    confirmHelper.confirm(t("CONFIRM_PUBLICATION"), () => {
      productServices
        .publish(productId, true)
        .then(() => {
          productServices.productsUpdatedSubject.next();
          toast.success(t("PRODUCT_PUBLISHED"));
        })
        .catch(() => toast.error(t("ISSUE_HAPPENED_WHILE_PUBLISHING")));
    });
  };

  return (
    <RowActionButton
      title={t("PUBLISH")}
      icon="fa fa-globe"
      color="success"
      onClick={publishProduct}
    />
  );
};

PublishProductButton.propTypes = {
  productId: PropTypes.string.isRequired,
};

export default withTranslation()(PublishProductButton);
