import React from "react";
import '../assets/scss/animated-checks.scss';
import PropTypes from "prop-types";
import {
    Form,
    FormGroup,
    Input,
    Row,
    Button,
    UncontrolledTooltip,
    UncontrolledPopover,
    PopoverBody, InputGroup, InputGroupText, InputGroupAddon, Container, Badge
} from "reactstrap";
import DropdownSelect from "./DropdownSelect";
import productServices from '../services/product.service';

class SearchEngine extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filterNb: 0,
            minPrice: '',
            maxPrice: '',
            free: false,
            automaticAcceptance: false,
            prime: false,
            category: undefined,
            keyWords: '',
            isPopoverOpen: false,
            categories: []
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCheckChange = this.handleCheckChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.resetFilters = this.resetFilters.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        productServices.getProductCategories().then(categories => this.setState({ categories }));
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if ("data" in nextProps) {
            this.setState({
                ...nextProps.data
            }, this.filterNbCalculation);
        }
    }

    filterNbCalculation() {
        let filterNb = 0;
        if (this.state.minPrice !== '' || this.state.maxPrice !== '') {
            filterNb++;
        }
        if (this.state.free) {
            filterNb++;
        }
        if (this.state.automaticAcceptance) {
            filterNb++;
        }
        if (this.state.prime) {
            filterNb++;
        }
        this.setState({ filterNb });
    }

    handleInputChange = (event) => {
        const {value, name} = event.target;
        this.setState({
            [name]: value
        }, this.filterNbCalculation);
    };

    handleCheckChange = (event) => {
        const {checked, name} = event.target;
        this.setState({
            [name]: checked
        }, this.filterNbCalculation);
    };

    onSubmit = e => {
        e.preventDefault();
        this.setState({ isPopoverOpen: false }, () => {
            this.props.onSearch({
                minPrice: this.state.minPrice,
                maxPrice: this.state.maxPrice,
                free: this.state.free,
                automaticAcceptance: this.state.automaticAcceptance,
                prime: this.state.prime,
                category: this.state.category,
                keyWords: this.state.keyWords
            });
        });
    };

    resetFilters() {
        this.setState({
            filterNb: 0,
            minPrice: '',
            maxPrice: '',
            free: false,
            automaticAcceptance: false,
            prime: false
        });
    }

    toggle() {
        this.setState({isPopoverOpen: !this.state.isPopoverOpen});
    }

    render() {

        return (
            <>
                <Form className="p-4 rounded bg-translucent-light" onSubmit={this.onSubmit}>
                    <Row>
                        <div className="col-md-3 text-center col-12">
                            <FormGroup className="mb-md-0">
                                <DropdownSelect
                                    className={"w-100"} name={"category"}
                                    placeholder={"Catégories"}
                                    value={this.state.category}
                                    onChange={this.handleInputChange}
                                    options={this.state.categories}/>
                            </FormGroup>
                        </div>
                        <div className="col-md-5 text-center col-12">
                            <FormGroup className="mb-0">
                                <Input type="text" placeholder={"Mots clés"}
                                       className="form-control-alternative"
                                       name="keyWords" onChange={this.handleInputChange}
                                       value={this.state.keyWords}
                                />
                            </FormGroup>
                        </div>
                        <div className="col-12 col-md-1 text-center">
                            <FormGroup className="mb-0 mx-auto w-fit-content position-relative">
                                <i className="fa fa-filter fa-lg text-light p-3 cursor-pointer filter-icon"
                                   data-placement="top"
                                   id="filterIcon"/>
                                {this.state.filterNb ? (
                                    <Badge color="primary" className="badge-circle position-absolute top-0 right-0">
                                        {this.state.filterNb}
                                    </Badge>
                                ) : null}
                                <UncontrolledTooltip
                                    delay={0}
                                    placement="top"
                                    target="filterIcon"
                                >
                                    Plus de filtres
                                </UncontrolledTooltip>
                                <UncontrolledPopover placement="auto" target="filterIcon" className={"filter-popover"}
                                                     isOpen={this.state.isPopoverOpen} toggle={this.toggle}>
                                    <PopoverBody className="bg-secondary rounded">
                                        <Container>
                                            <Row className="mt-2">
                                                <div className="col-6">
                                                    <FormGroup className="mb-0 w-100">
                                                        <InputGroup className="input-group-alternative">
                                                            <Input type="number" placeholder={"Prix init min"}
                                                                   name="minPrice" min={0} value={this.state.minPrice}
                                                                   className="form-control-alternative"
                                                                   onChange={this.handleInputChange}/>
                                                            <InputGroupAddon addonType="append">
                                                                <InputGroupText>
                                                                    <i className="fa fa-euro"/>
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                        </InputGroup>
                                                    </FormGroup>
                                                </div>
                                                <div className="col-6">
                                                    <FormGroup className="mb-0 w-100">
                                                        <InputGroup className="input-group-alternative">
                                                            <Input type="number" placeholder={"Prix init max"}
                                                                   name="maxPrice" min={0} value={this.state.maxPrice}
                                                                   className="form-control-alternative"
                                                                   onChange={this.handleInputChange}/>
                                                            <InputGroupAddon addonType="append">
                                                                <InputGroupText>
                                                                    <i className="fa fa-euro"/>
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                        </InputGroup>
                                                    </FormGroup>
                                                </div>
                                            </Row>
                                            <Row className="mt-2">
                                                <div className="col-12 d-flex">
                                                    <label className="custom-toggle mt-2">
                                                        <input type="checkbox" name="free"
                                                               onChange={this.handleCheckChange}
                                                               id="freeInput" checked={this.state.free}/>
                                                        <span className="custom-toggle-slider rounded-circle"/>
                                                    </label>
                                                    <label htmlFor="freeInput" className="mt-2 ml-2 cursor-pointer">
                                                        Gratuits
                                                    </label>
                                                </div>
                                            </Row>
                                            <Row className="mt-2">
                                                <div className="col-12 d-flex">
                                                    <label className="custom-toggle mt-2">
                                                        <input type="checkbox" name="automaticAcceptance"
                                                               onChange={this.handleCheckChange}
                                                               id="automaticAcceptanceInput"
                                                               checked={this.state.automaticAcceptance}/>
                                                        <span className="custom-toggle-slider rounded-circle"/>
                                                    </label>
                                                    <label htmlFor="automaticAcceptanceInput"
                                                           className="mt-2 ml-2 cursor-pointer">
                                                        Acceptation Automatique
                                                    </label>
                                                </div>
                                            </Row>
                                            <Row className="mt-2">
                                                <div className="col-12 d-flex">
                                                    <label className="custom-toggle mt-2">
                                                        <input type="checkbox" name="prime"
                                                               onChange={this.handleCheckChange}
                                                               id="primeInput" checked={this.state.prime}/>
                                                        <span className="custom-toggle-slider rounded-circle"/>
                                                    </label>
                                                    <label htmlFor="primeInput" className="mt-2 ml-2 cursor-pointer">
                                                        Prime
                                                    </label>
                                                </div>
                                            </Row>
                                            <Row className="mt-2">
                                                <div className="col-12">
                                                    {
                                                        this.state.filterNb ? (

                                                            <Button color="danger" outline
                                                                    onClick={this.resetFilters}>Reset</Button>

                                                        ) : null
                                                    }
                                                    <Button color="secondary" className="float-right" outline
                                                            onClick={this.toggle}>Fermer</Button>
                                                </div>
                                            </Row>

                                        </Container>
                                    </PopoverBody>
                                </UncontrolledPopover>

                            </FormGroup>
                        </div>
                        <div className="col-md-3 text-center col-12">
                            <FormGroup className="mb-0">
                                <Button type="submit" color={"primary"} className="w-100">
                                    <i className="fa fa-search"/>
                                    <span className="ml-2">Rechercher</span>
                                </Button>
                            </FormGroup>
                        </div>
                    </Row>
                </Form>
            </>
        );
    }
}

SearchEngine.propTypes = {
    onSearch: PropTypes.func.isRequired,
    data: PropTypes.object
};

export default SearchEngine;
