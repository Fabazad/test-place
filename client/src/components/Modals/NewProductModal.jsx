import React, { useEffect, useState } from "react";
// reactstrap components
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Modal,
  Row,
} from "reactstrap";
import ModalFooter from "reactstrap/es/ModalFooter";
import Loading from "../../components/Loading";
import productService from "../../services/product.service";
import s3Services from "../../services/s3.services";
import ProductForm from "../Forms/ProductForm";

const NewProductModal = ({ t }) => {
  const history = useHistory();

  const [defaultData, setDefaultData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [asinInput, setAsinInput] = useState("");
  const [loadingPromise, setLoadingPromise] = useState(null);

  const toggleModal = () => {
    history.push({ hash: isOpen ? "" : "#postProductModal" });
  };

  useEffect(() => {
    setIsOpen(history.location.hash === "#postProductModal");
  }, [history.location]);

  const scrapAsin = () => {
    if (!asinInput || !asinInput.length) {
      toast.error(t("MISSING_ASIN"));
      return;
    }
    const match = asinInput.match(/(?:[/dp/]|$)?([A-Z0-9]{10})/);
    if (!match) {
      toast.error(t("WRONG_ASIN"));
      return;
    }
    const asin = match[1];
    const loadingPromise = productService.scrapFromAsin(asin).then((res) => {
      setDefaultData({
        asin,
        title: res.title,
        price: res.price,
        description: res.description,
        images: res.imageUrls,
        isPrime: res.isPrime,
        category: res.category,
        pictures: [null],
        amazonSeller: res.seller,
      });
    });
    setLoadingPromise(loadingPromise);
  };

  const resetForm = () => {
    setAsinInput(null);
    setDefaultData({});
  };

  const onSubmit = (formData) => {
    const loadingPromise = new Promise(async (resolve, reject) => {
      const product = formData;

      product.imageUrls = await Promise.all(
        product.images.map((image, index) => {
          if (typeof image === "object") {
            return s3Services.upload(image);
          }
          return image;
        })
      );

      delete product.images;
      return productService
        .create(product)
        .then(() => {
          toast.success(t("PRODUCT_ADDED_AND_PUBLISHED"));
          toggleModal();
          resetForm();
          resolve();
          productService.productsUpdatedSubject.next();
        })
        .catch(reject);
    });

    setLoadingPromise(loadingPromise);
  };

  const onAsinSubmit = (e) => {
    e.preventDefault();
    scrapAsin();
  };

  return (
    <>
      {/* Button trigger modal */}
      <Button color="primary" onClick={toggleModal}>
        <i className="ni ni-bag-17 mr-2" />
        {t("NEW_PRODUCT")}
      </Button>
      {/* Modal */}
      <Modal
        className="modal-dialog-centered"
        isOpen={isOpen}
        toggle={toggleModal}
        size="lg"
      >
        <Loading promise={loadingPromise} />
        <div className="modal-header bg-secondary">
          <h2 className="modal-title" id="exampleModalLabel">
            {t("NEW_PRODUCT")}
          </h2>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={toggleModal}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className="modal-body white-space-pre-line bg-secondary">
          <form onSubmit={onAsinSubmit}>
            <Row>
              <div className="col-12 col-md-8 col-lg-9">
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="fa fa-hashtag" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder={t("ASIN_PLACEHOLDER")}
                      type="text"
                      name="asinInput"
                      value={asinInput}
                      onChange={(e) => setAsinInput(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>
              </div>
              <div className="col-12 col-md-4 col-lg-3">
                <Button
                  color="primary"
                  className="mb-3 w-100"
                  disabled={!asinInput}
                  type="submit"
                >
                  {t("PRE_FILL")}
                </Button>
              </div>
            </Row>
          </form>
          {defaultData.asin ? (
            <ProductForm onSubmit={onSubmit} defaultData={defaultData} />
          ) : null}
        </div>

        <ModalFooter className="bg-secondary">
          <Button
            color="secondary"
            data-dismiss="modal"
            type="button"
            onClick={toggleModal}
          >
            {t("CANCEL")}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default withTranslation()(NewProductModal);
