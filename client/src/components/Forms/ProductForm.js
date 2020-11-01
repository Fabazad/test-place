import PropTypes from "prop-types";

import {
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    PopoverBody,
    Row,
    UncontrolledPopover
} from "reactstrap";
import MultiImageUploader from "../MultiImageUploader";
import TagsInput from "react-tagsinput";
import DropdownSelect from "../DropdownSelect";
import React, {useEffect, useState} from "react";
import Button from "reactstrap/es/Button";
import productService from "../../services/product.service";
import Col from "reactstrap/es/Col";
import {toast} from "react-toastify";
import {withTranslation} from "react-i18next";

const ProductForm = props => {

        const {defaultData, t} = props;

        const asin = defaultData.asin ?? null;

        const [title, setTitle] = useState(defaultData.title ?? undefined);
        const [price, setPrice] = useState(defaultData.price ?? '');
        const [finalPrice, setFinalPrice] = useState(defaultData.finalPrice ?? '');
        const [images, setImages] = useState(defaultData.images ?? []);
        const [description, setDescription] = useState(defaultData.description ?? undefined);
        const [isPrime, setIsPrime] = useState(defaultData.isPrime ?? false);
        const [maxDemands, setMaxDemands] = useState(defaultData.maxDemands ?? '');
        const [automaticAcceptance, setAutomaticAcceptance] = useState(defaultData.automaticAcceptance ?? false);
        const [category, setCategory] = useState(undefined);
        const [keywords, setKeywords] = useState(defaultData.keywords ?? []);
        const [categories, setCategories] = useState([]);
        const [privateNote, setPrivateNote] = useState(defaultData.privateNote ?? undefined)

        useEffect(() => {
            productService.getProductCategories().then(categories => setCategories(categories));
        }, []);

        useEffect(() => {
            if (categories.length) {
                setCategory(defaultData.category);
            }
        }, [defaultData.category, categories]);

        const onSubmit = e => {
            e.preventDefault();
            if (!category) {
                toast.error(t("MISSING_CATEGORY"));
                return;
            }
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
                keywords,
                privateNote
            });
        };

        return (
            <Form role="form" onSubmit={onSubmit}>
                <div className="border-top">
                    <div className="w-100 my-3">
                        <MultiImageUploader images={images} maxFile={6} onChange={images => setImages(images)}/>
                    </div>
                </div>
                <Row>
                    <div className="col-12">
                        <FormGroup className="mb-3">
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
                <Row>
                    <div className="col-12">
                        <FormGroup className="mb-3">
                            <InputGroup className="input-group-alternative">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="fa fa-angle-right"/>
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    placeholder={t("TITTLE")}
                                    type="text"
                                    name="title"
                                    defaultValue={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                />
                            </InputGroup>
                        </FormGroup>
                    </div>
                </Row>
                <Row>
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
                                    inputProps={{placeholder: t("KEYWORDS_PLACEHOLDER")}}
                                    addOnPaste={true}
                                    addKeys={[9, 13, 44, 32, 188, 190]}
                                />
                            </InputGroup>
                        </FormGroup>
                    </div>
                </Row>

                <hr/>

                <Row className="mb-3">
                    <Col xs={6}>
                        <DropdownSelect name="category" options={categories}
                                        className="w-100" value={category}
                                        onChange={e => setCategory(e.target.value)}
                                        placeholder={t("CATEGORY")}/>
                    </Col>
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
                <Row>
                    <Col xs={6}>
                        <FormGroup className="mb-3">
                            <InputGroup className="input-group-alternative">
                                <Input placeholder={t("PRICE")} type="number" step="0.01"
                                       min="0.01" name="price" defaultValue={price}
                                       onChange={e => setPrice(e.target.value)} required/>
                                <InputGroupAddon addonType="append">
                                    <InputGroupText>
                                        <i className="fa fa-euro"/>
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        </FormGroup>
                    </Col>
                    <Col xs={6}>
                        <FormGroup className="mb-3">
                            <InputGroup className="input-group-alternative">
                                <Input
                                    placeholder={t("FINAL_PRICE")}
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
                    </Col>
                </Row>

                <Row>
                    <Col xs={12}>
                        <FormGroup className="mb-3">
                            <Input
                                className="form-control-alternative"
                                placeholder={t("DESCRIPTION")}
                                rows="10"
                                type="textarea"
                                name="description"
                                defaultValue={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <hr/>

                <Row className="mt-3">
                    <FormGroup className="col-md-6 col-12">
                        <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="fa fa-user"/>
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input
                                placeholder={t("MAX_DEMANDS_PLACEHOLDER")}
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
                                {t("AUTOMATIC_ACCEPTANCE_LABEL")}
                            </label>
                            <i className="fa fa-question-circle ml-3 cursor-pointer"
                               id="tooltip348236073"/>
                            <UncontrolledPopover
                                placement="top"
                                target="tooltip348236073"
                                className="popover-default"
                            >
                                <PopoverBody className="text-center white-space-pre-line">
                                    {t("AUTOMATIC_ACCEPTANCE_EXPLAINED_SELLER")}
                                </PopoverBody>
                            </UncontrolledPopover>
                        </div>
                    </FormGroup>
                </Row>
                <hr/>
                <Row>
                    <Col xs={12}>
                        <FormGroup>
                            <Input
                                className="form-control-alternative"
                                placeholder={t("PRIVATE_NOTE_PLACEHOLDER")}
                                rows="3"
                                type="textarea"
                                name="privateNote"
                                defaultValue={privateNote}
                                onChange={e => setPrivateNote(e.target.value)}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <div className="mt-3">
                    <Button type="submit" color="primary">{t("SAVE")}</Button>
                </div>
            </Form>
        );
    }
;

ProductForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    defaultData: PropTypes.object.isRequired
};

export default withTranslation()(ProductForm);