import PropTypes from "prop-types";
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Button from "reactstrap/es/Button";
import confirmHelper from "../../helpers/confirmHelper";
import { TestStatus } from "../../helpers/constants";
import testServices from "../../services/test.services";
import Loading from "../Loading";
import NewTestModal from "../Modals/NewTestModal";
import NewTestRequestModal from "../Modals/NewTestRequestModal/NewTestRequestModal";

const NewTestButton = (props) => {
  const { productId, disabled, t } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    confirmHelper.confirm(t("CONFIRM_TEST_REQUEST"), async () => {
      setLoading(true);
      const res = await testServices.create({
        productId: productId,
        status: TestStatus.REQUEST_ACCEPTED,
      });

      if (res?.error) {
        if (res.error === "already_testing")
          toast.error(t("ALREADY_TESTING_THIS_PRODUCT"));
        else if (res.error === "previous_request_declined")
          toast.error(t("PREVIOUS_REQUEST_DECLINED_ON_THIS_PRODUCT"));
        else toast.error(res.error);
      } else {
        onToggle();
      }

      setLoading(false);
    });
  };

  const onToggle = () => setIsOpen(!isOpen);

  return (
    <>
      <Loading loading={loading} />
      <Button color="info" size="lg" onClick={handleClick} disabled={disabled}>
        <i className="fa fa-bolt text-yellow mr-2" />
        {t("TEST_PRODUCT")}
      </Button>
      <NewTestModal isOpen={isOpen} onToggle={onToggle} />
    </>
  );
};

NewTestRequestModal.propTypes = {
  productId: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

export default withTranslation()(NewTestButton);
