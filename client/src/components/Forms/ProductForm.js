import PropTypes from "prop-types";

import {
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Label, PopoverBody,
    Row,
    UncontrolledPopover
} from "reactstrap";
import MultiImageUploader from "../MultiImageUploader";
import TagsInput from "react-tagsinput";
import DropdownSelect from "../DropdownSelect";
import React, {useEffect, useState} from "react";
import Button from "reactstrap/es/Button";
import productService from "../../services/product.service";

const ProductForm = props => {

        const {defaultData} = props;

        const asin = defaultData.asin ?? null;

        const [title, setTitle] = useState(defaultData.title ?? null);
        const [price, setPrice] = useState(defaultData.price ?? null);
        const [finalPrice, setFinalPrice] = useState(defaultData.finalPrice ?? null);
        const [images, setImages] = useState(defaultData.images ?? []);
        const [description, setDescription] = useState(defaultData.description ?? null);
        const [isPrime, setIsPrime] = useState(defaultData.isPrime ?? false);
        const [maxDemands, setMaxDemands] = useState(defaultData.maxDemands ?? null);
        const [automaticAcceptance, setAutomaticAcceptance] = useState(defaultData.automaticAcceptance ?? false);
        const [category, setCategory] = useState(defaultData.category ?? null);
        const [keywords, setKeywords] = useState(defaultData.keywords ?? []);
        const [categories, setCategories] = useState([]);

        useEffect(() => {
            productService.getProductCategories().then(categories => setCategories(categories));
        }, []);

        const onSubmit = e => {
            e.preventDefault();
            props.onSubmit({
                asin,
                title,
                price,
                finalPrice,
                images,
                description,
                isPrime,
                maxDemands,
                automaticAcceptance,
                category,
                keywords
            });
        };


        return (

            <Form role="form" onSubmit={onSubmit}>
                <div className="border-top">
                    <div className="w-100 my-3">
                        <MultiImageUploader images={images} maxFile={6} onChange={images => setImages(images)}/>
                    </div>
                </div>
                <div className="border-top border-bottom">
                    <Row>
                        <div className="col-12">
                            <FormGroup className="mb-3">
                                <Label>ASIN</Label>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText className="bg-light">
                                            <i className="fa fa-hashtag"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        className="pl-2"
                                        placeholder="ASIN"
                                        type="text"
                                        name="asin"
                                        defaultValue={asin}
                                        required disabled
                                    />
                                </InputGroup>
                            </FormGroup>
                        </div>
                    </Row>
                    <div className="row">
                        <div className="col-12">
                            <FormGroup className="mb-3">
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="fa fa-angle-right"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="Titre"
                                        type="text"
                                        name="title"
                                        defaultValue={title}
                                        onChange={e => setTitle(e.target.value)}
                                        required
                                    />
                                </InputGroup>
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <FormGroup className="mb-3">
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText className="position-absolute" style={{top: "5px"}}>
                                            <i className="ni ni-key-25"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <TagsInput
                                        className="bootstrap-tagsinput w-100"
                                        onChange={val => setKeywords(val)}
                                        tagProps={{className: "tag badge mr-1"}}
                                        value={keywords}
                                        inputProps={{placeholder: "Ajouter des mots clés"}}
                                        addOnPaste={true}
                                        addKeys={[9, 13, 44, 32, 188, 190]}
                                    />
                                </InputGroup>
                            </FormGroup>
                        </div>
                    </div>
                    <Row className="mb-3">
                        <div className="col-6">
                            <DropdownSelect name="category" options={categories}
                                            className="w-100" value={category}
                                            onChange={e => setCategory(e.target.value)}
                                            placeholder="Catégorie"/>
                        </div>
                        <div className="col-6 text-center d-flex">
                            <label className="custom-toggle mt-2">
                                <input type="checkbox" name="isPrime" checked={isPrime}
                                       onChange={e => setIsPrime(e.target.checked)} id="isPrimeInput"/>
                                <span className="custom-toggle-slider rounded-circle"/>
                            </label>
                            <label htmlFor="isPrimeInput" className="mt-2 ml-2">
                                <img src={require("assets/img/icons/prime.png")} alt="prime"
                                     style={{"height": "18px"}}/>
                            </label>
                        </div>
                    </Row>
                    <div className="row">
                        <div className="col-6">
                            <FormGroup className="mb-3">
                                <InputGroup className="input-group-alternative">
                                    <Input placeholder="Prix" type="number" step="0.01"
                                           min="0.01" name="price" defaultValue={price}
                                           onChange={e => setPrice(e.target.value)} required/>
                                    <InputGroupAddon addonType="append">
                                        <InputGroupText>
                                            <i className="fa fa-euro"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            </FormGroup>
                        </div>
                        <div className="col-6">
                            <FormGroup className="mb-3">
                                <InputGroup className="input-group-alternative">
                                    <Input
                                        placeholder="Prix Final"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        name="finalPrice"
                                        value={finalPrice}
                                        onChange={e => setFinalPrice(e.target.value)}
                                        required
                                    />
                                    <InputGroupAddon addonType="append">
                                        <InputGroupText>
                                            <i className="fa fa-euro"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            </FormGroup>
                        </div>
                    </div>

                    <FormGroup className="mb-3">
                        <Input
                            className="form-control-alternative"
                            placeholder="Description"
                            rows="10"
                            type="textarea"
                            name="description"
                            defaultValue={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        />
                    </FormGroup>
                </div>
                <div className="mt-3">
                    <div className="row">
                        <FormGroup className="col-md-6 col-12">
                            <InputGroup className="input-group-alternative">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="fa fa-user"/>
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    placeholder="Nombre maximum de demande"
                                    type="number"
                                    step="1"
                                    min="1"
                                    name="maxDemands"
                                    defaultValue={maxDemands}
                                    onChange={e => setMaxDemands(e.target.value)}
                                    required
                                />
                            </InputGroup>
                        </FormGroup>
                        <FormGroup className="col-md-6 col-12">
                            <div
                                className="custom-control custom-control-alternative custom-checkbox mt-2">
                                <input
                                    className="custom-control-input"
                                    id="customCheck6"
                                    type="checkbox"
                                    name="automaticAcceptance"
                                    checked={automaticAcceptance}
                                    onChange={e => setAutomaticAcceptance(e.target.checked)}
                                />
                                <label className="custom-control-label" htmlFor="customCheck6">
                                    Acceptation automatique des demandes
                                </label>
                                <i className="fa fa-question-circle ml-3 cursor-pointer"
                                   id="tooltip348236073"/>
                                <UncontrolledPopover
                                    placement="top"
                                    target="tooltip348236073"
                                    className="popover-default"
                                >
                                    <PopoverBody className="text-center">
                                        Permet d'afficher le bouton qui permet aux testeurs d'avoir
                                        directement leur demande validée sans action de la part du
                                        vendeur.<br/>
                                        Seulement les testeurs ayants souscrits à l'option premium
                                        auront la
                                        possibilité de faire des demandes automatiques.
                                    </PopoverBody>
                                </UncontrolledPopover>
                            </div>
                        </FormGroup>
                    </div>
                </div>
                <div className="mt-3">
                    <Button type="submit" color="primary">Enregistrer</Button>
                </div>
            </Form>
        );
    }
;

ProductForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    defaultData: PropTypes.object.isRequired
};

export default ProductForm;