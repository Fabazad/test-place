import React, {useState} from "react";
// reactstrap components
import {
    Button,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Modal,
    Row
} from "reactstrap";
import {toast} from "react-toastify";
import Loading from "../../components/Loading";
import productService from "../../services/product.service";
import s3Services from "../../services/s3.services";
import ProductForm from "../Forms/ProductForm";
import ModalFooter from "reactstrap/es/ModalFooter";

const NewProductModal = () => {

    const [defaultData, setDefaultData] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [asinInput, setAsinInput] = useState(null);
    const [loadingPromise, setLoadingPromise] = useState(null);

    const toggleModal = () => setIsOpen(!isOpen);

    const scrapAsin = () => {
        if (!asinInput || !asinInput.length) {
            toast.error("Veuillez fournir l'identifiant ASIN ou l'url du produit.");
            return;
        }
        const match = asinInput.match(/(?:[/dp/]|$)?([A-Z0-9]{10})/);
        if (!match) {
            toast.error("ASIN ou url du produit incorrecte.");
            return;
        }
        const asin = match[1];
        const loadingPromise = productService.scrapFromAsin(asin).then(res => {
            setDefaultData({
                asin,
                title: res.title,
                price: res.price,
                description: res.description,
                images: res.imageUrls,
                isPrime: res.isPrime,
                category: res.category,
                pictures: [null],
                amazonSeller: res.seller
            });
        });
        setLoadingPromise(loadingPromise);
    };

    const resetForm = () => setDefaultData({});

    const onSubmit = (formData) => {
        const loadingPromise = new Promise(async (resolve, reject) => {
            const product = formData;

            const s3promises = [];
            product.images.forEach((image, index) => {
                if (typeof image === 'object') {
                    s3promises.push(
                        new Promise(async resolve => {
                            product.images[index] = await s3Services.upload(image);
                            resolve();
                        })
                    );
                }
            });
            await Promise.all(s3promises);
            product.imageUrls = product.images;
            delete product.images;
            return productService.create(product).then(() => {
                toast.success("Product added");
                toggleModal();
                resetForm();
                productService.productsUpdatedSubject.next();
            }).catch(reject);
        });

        setLoadingPromise(loadingPromise);
    };

    return (
        <>
            {/* Button trigger modal */}
            <Button color="primary" onClick={toggleModal}>
                <i className="ni ni-bag-17 mr-2"/>
                Nouveau Produit
            </Button>
            {/* Modal */}
            <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={toggleModal} size="lg">
                <Loading promise={loadingPromise}/>
                <div className="modal-header bg-secondary">
                    <h2 className="modal-title" id="exampleModalLabel">
                        Nouveau Produit
                    </h2>
                    <button aria-label="Close" className="close" data-dismiss="modal" type="button"
                            onClick={toggleModal}>
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <div className="modal-body white-space-pre-line bg-secondary">
                    <div>
                        <Row>
                            <div className="col-12 col-md-8 col-lg-9">
                                <FormGroup className="mb-3">
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="fa fa-hashtag"/>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input placeholder="ASIN ou Lien amazon du produit" type="text"
                                               name="asinInput" value={asinInput}
                                               onChange={e => setAsinInput(e.target.value)}/>
                                    </InputGroup>
                                </FormGroup>
                            </div>
                            <div className="col-12 col-md-4 col-lg-3">
                                <Button color="primary" className="mb-3 w-100" onClick={scrapAsin}>Pré-Remplir</Button>
                            </div>

                        </Row>
                    </div>
                    {defaultData.asin ? (
                        <ProductForm onSubmit={onSubmit} defaultData={defaultData}/>
                    ) : null}
                </div>

                <ModalFooter className="bg-secondary">
                    <Button color="secondary" data-dismiss="modal" type="button" onClick={toggleModal}>
                        Fermer
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default NewProductModal;