import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import {
  Badge,
  Button,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  PopoverBody,
  Row,
  UncontrolledPopover,
  UncontrolledTooltip,
} from "reactstrap";
import "../assets/scss/animated-checks.scss";
import productServices from "../services/product.service";
import DropdownSelect from "./DropdownSelect";

const SearchEngine = (props) => {
  const { data, lean = false, onSearch, t } = props;

  const [values, setValues] = useState({
    free: false,
    automaticAcceptance: false,
    prime: false,
  });

  const [filterNb, setFilterNb] = useState(0);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    productServices
      .getProductCategories()
      .then((categories) =>
        setCategories(
          categories.map((c) => ({ value: c, text: t("PRODUCT_CATEGORIES." + c) }))
        )
      );
  }, []);

  useEffect(() => {
    setValues({ ...values, ...data });
  }, [data]);

  const filterNbCalculation = () => {
    let newFilterNb = 0;
    if (values.minPrice !== undefined && values.minPrice !== "") newFilterNb++;
    if (values.maxPrice !== undefined && values.maxPrice !== "") newFilterNb++;
    if (values.free) newFilterNb++;
    if (values.automaticAcceptance) newFilterNb++;
    if (values.prime) newFilterNb++;
    setFilterNb(newFilterNb);
  };

  useEffect(() => {
    filterNbCalculation();
  }, [values]);

  const handleInputChange = (event) => {
    const { value, name } = event.target;
    if (value === "") {
      delete values[name];
      setValues({ ...values });
      return;
    }
    if (name === "category" && value === null) {
      delete values[name];
      setValues({ ...values });
      return;
    }
    setValues({ ...values, [name]: value });
  };

  const handleCheckChange = (event) => {
    const { checked, name } = event.target;
    setValues({ ...values, [name]: checked });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setIsPopoverOpen(false);
    onSearch(values);
  };

  const resetFilters = () => {
    setValues({
      ...values,
      filterNb: 0,
      free: false,
      automaticAcceptance: false,
      prime: false,
      minPrice: "",
      maxPrice: "",
    });
  };

  const toggle = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  return (
    <Form onSubmit={onSubmit} className="d-flex justify-content-center gap-1 flex-wrap">
      <div className="text-center" style={{ minWidth: "15em" }}>
        <FormGroup className="mb-0">
          <DropdownSelect
            className={"w-100"}
            name={"category"}
            placeholder={t("CATEGORIES")}
            value={values.category}
            onChange={handleInputChange}
            options={categories}
          />
        </FormGroup>
      </div>
      <div className="text-center flex-1" style={{ minWidth: "20em" }}>
        <FormGroup className="mb-0">
          <Input
            type="text"
            placeholder={t("SEARCH_PRODUCT")}
            className="form-control-alternative"
            name="keyWords"
            onChange={handleInputChange}
            value={values.keyWords}
          />
        </FormGroup>
      </div>
      {lean === false && (
        <div className="text-center">
          <FormGroup className="mb-0 mx-auto w-fit-content position-relative">
            <i
              className="fa fa-filter fa-lg text-light p-3 cursor-pointer filter-icon"
              data-placement="top"
              id="filterIcon"
            />
            {filterNb > 0 && (
              <Badge color="primary" pill className="position-absolute top-0 right-0">
                {filterNb}
              </Badge>
            )}
            <UncontrolledTooltip delay={0} placement="top" target="filterIcon">
              {t("MORE_FILTERS")}
            </UncontrolledTooltip>
            <UncontrolledPopover
              placement="auto"
              target="filterIcon"
              className={"filter-popover"}
              isOpen={isPopoverOpen}
              toggle={toggle}
            >
              <PopoverBody className="bg-secondary rounded">
                <Container>
                  <Row className="mt-2">
                    <div className="col-6">
                      <FormGroup className="mb-0 w-100">
                        <InputGroup className="input-group-alternative">
                          <Input
                            type="number"
                            placeholder={t("MIN_INITIAL_PRICE")}
                            name="minPrice"
                            min={0}
                            value={values.minPrice}
                            className="form-control-alternative"
                            onChange={handleInputChange}
                          />
                          <InputGroupAddon addonType="append">
                            <InputGroupText>
                              <i className="fa fa-euro" />
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      </FormGroup>
                    </div>
                    <div className="col-6">
                      <FormGroup className="mb-0 w-100">
                        <InputGroup className="input-group-alternative">
                          <Input
                            type="number"
                            placeholder={t("MAX_INITIAL_PRICE")}
                            name="maxPrice"
                            min={0}
                            value={values.maxPrice}
                            className="form-control-alternative"
                            onChange={handleInputChange}
                          />
                          <InputGroupAddon addonType="append">
                            <InputGroupText>
                              <i className="fa fa-euro" />
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      </FormGroup>
                    </div>
                  </Row>
                  <Row className="mt-2">
                    <div className="col-12 d-flex">
                      <label className="custom-toggle mt-2">
                        <input
                          type="checkbox"
                          name="free"
                          onChange={handleCheckChange}
                          id="freeInput"
                          checked={values.free}
                        />
                        <span className="custom-toggle-slider rounded-circle" />
                      </label>
                      <label htmlFor="freeInput" className="mt-2 ml-2 cursor-pointer">
                        {t("FREE")}
                      </label>
                    </div>
                  </Row>
                  <Row className="mt-2">
                    <div className="col-12 d-flex">
                      <label className="custom-toggle mt-2">
                        <input
                          type="checkbox"
                          name="automaticAcceptance"
                          onChange={handleCheckChange}
                          id="automaticAcceptanceInput"
                          checked={values.automaticAcceptance}
                        />
                        <span className="custom-toggle-slider rounded-circle" />
                      </label>
                      <label
                        htmlFor="automaticAcceptanceInput"
                        className="mt-2 ml-2 cursor-pointer"
                      >
                        {t("AUTOMATIC_ACCEPTANCE")}
                      </label>
                    </div>
                  </Row>
                  <Row className="mt-2">
                    <div className="col-12 d-flex">
                      <label className="custom-toggle mt-2">
                        <input
                          type="checkbox"
                          name="prime"
                          onChange={handleCheckChange}
                          id="primeInput"
                          checked={values.prime}
                        />
                        <span className="custom-toggle-slider rounded-circle" />
                      </label>
                      <label htmlFor="primeInput" className="mt-2 ml-2 cursor-pointer">
                        Prime
                      </label>
                    </div>
                  </Row>
                  <Row className="mt-2">
                    <div className="col-12">
                      {filterNb > 0 && (
                        <Button color="danger" outline onClick={resetFilters}>
                          {t("RESET")}
                        </Button>
                      )}
                      <Button
                        color="secondary"
                        className="float-right"
                        outline
                        onClick={toggle}
                      >
                        OK
                      </Button>
                    </div>
                  </Row>
                </Container>
              </PopoverBody>
            </UncontrolledPopover>
          </FormGroup>
        </div>
      )}
      <div className="text-center">
        <FormGroup className="mb-0">
          <UncontrolledTooltip target="search-button" delay={0}>
            {t("SEARCH")}
          </UncontrolledTooltip>
          <Button type="submit" color="primary" id="search-button">
            <i className="fa fa-search" />
            <span className="ml-2">{t("SEARCH")}</span>
          </Button>
        </FormGroup>
      </div>
    </Form>
  );
};

SearchEngine.propTypes = {
  onSearch: PropTypes.func.isRequired,
  data: PropTypes.object,
  lean: PropTypes.bool,
};

export default withTranslation()(SearchEngine);
