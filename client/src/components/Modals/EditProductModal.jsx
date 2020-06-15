import React, {useEffect, useState} from "react";
// reactstrap components
import {
    Button,
    Modal
} from "reactstrap";
import {toast} from "react-toastify";
import Loading from "../../components/Loading";
import productService from "../../services/product.service";
import s3Services from "../../services/s3.services";
import PropTypes from "prop-types";
import RowActionButton from "../Buttons/RowActionButton";
import ProductForm from "../Forms/ProductForm";

const EditProductModal = props => {

    const {product} = props;

    const [defaultData, setDefaultData] = useState({images: product.imageUrls, ...product});
    const [isOpen, setIsOpen] = useState(false);
    const [loadingPromise, setLoadingPromise] = useState(null);

    useEffect(() => {
        setDefaultData({images: product.imageUrls, ...product});
    }, [props.product]);

    const toggleModal = () => setIsOpen(!isOpen);

    const resetForm = () => setDefaultData({});

    const onSubmit = (formData) => {
        const loadingPromise = new Promise(async (resolve, reject) => {
            console.log(formData);
            const newProduct = formData;

            const s3promises = [];
            newProduct.images.forEach((image, index) => {
                if (typeof image === 'object') {
                    s3promises.push(
                        new Promise(async resolve => {
                            newProduct.images[index] = await s3Services.upload(image);
                            resolve();
                        })
                    );
                }
            });
            await Promise.all(s3promises);
            newProduct.imageUrls = product.images;
            delete newProduct.images;
            return productService.update(product._id, newProduct).then(() => {
                toast.success("Product updated");
                toggleModal();
                resetForm();
                resolve();
                productService.productsUpdatedSubject.next();
            }).catch(reject);
        });

        setLoadingPromise(loadingPromise);
    };

    return (
        <>
            {/* Button trigger modal */}
            <RowActionButton title="Editer" icon="fa fa-edit" color="warning" onClick={toggleModal}/>
            {/* Modal */}
            <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={toggleModal} size="lg">
                <Loading promise={loadingPromise}/>
                <div className="modal-header bg-secondary">
                    <h2 className="modal-title" id="exampleModalLabel">
                        Editer Produit
                    </h2>
                    <button aria-label="Close" className="close" data-dismiss="modal" type="button"
                            onClick={toggleModal}>
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <div className="modal-body white-space-pre-line bg-secondary">
                    <ProductForm onSubmit={onSubmit} defaultData={defaultData}/>
                </div>

                <div className="modal-footer bg-secondary ">
                    <Button color="secondary" data-dismiss="modal" type="button" onClick={toggleModal}>
                        Fermer
                    </Button>
                </div>
            </Modal>
        </>
    );
};

EditProductModal.propTypes = {
    product: PropTypes.object.isRequired
};

export default EditProductModal;