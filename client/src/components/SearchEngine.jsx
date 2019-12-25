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
    PopoverBody, InputGroup, InputGroupText, InputGroupAddon, Container
} from "reactstrap";
import DropdownSelect from "./DropdownSelect";

class SearchEngine extends React.Component {

    render() {
        return (
            <>
                <Form className="p-4 rounded bg-translucent-light">
                    <Row>
                        <div className="col-md-3 text-center col-12">
                            <FormGroup className="mb-md-0">
                                <DropdownSelect
                                    className={"w-100"} name={"category"}
                                    placeholder={"Catégories"}
                                    value={'test'}
                                    onChange={(value) => console.log(value)}
                                    options={[{value: 'test', text: 'testx'}]}/>
                            </FormGroup>
                        </div>
                        <div className="col-md-5 text-center col-12">
                            <FormGroup className="mb-0">
                                <Input type="text" placeholder={"Mots clés"} className="form-control-alternative"/>
                            </FormGroup>
                        </div>
                        <div className="col-12 col-md-1 text-center">
                            <FormGroup className="mb-0">
                                <i className="fa fa-filter fa-lg text-light p-3 cursor-pointer filter-icon"
                                   data-placement="top"
                                   id="filterIcon"/>
                                <UncontrolledTooltip
                                    delay={0}
                                    placement="top"
                                    target="filterIcon"
                                >
                                    Plus de filtres
                                </UncontrolledTooltip>
                                <UncontrolledPopover placement="auto" target="filterIcon" className={"filter-popover"}>
                                    <PopoverBody>
                                        <Container>
                                            <Row>
                                                <div className="col-6">
                                                    <FormGroup className="mb-0 w-100">
                                                        <InputGroup className="input-group-alternative">
                                                            <Input type="number" placeholder={"Prix init min"}
                                                                   className="form-control-alternative"/>
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
                                                                   className="form-control-alternative"/>
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
                                                        <input type="checkbox" name="onlyFree"
                                                               id="onlyFreeInput"/>
                                                        <span className="custom-toggle-slider rounded-circle"/>
                                                    </label>
                                                    <label htmlFor="onlyFreeInput" className="mt-2 ml-2">
                                                        Gratuits
                                                    </label>
                                                </div>
                                            </Row>
                                            <Row className="mt-2">
                                                <div className="col-12 d-flex">
                                                    <label className="custom-toggle mt-2">
                                                        <input type="checkbox" name="onlyAutomaticAcceptance"
                                                               id="onlyAutomaticAcceptanceInput"/>
                                                        <span className="custom-toggle-slider rounded-circle"/>
                                                    </label>
                                                    <label htmlFor="onlyAutomaticAcceptanceInput" className="mt-2 ml-2">
                                                        Acceptation Automatique
                                                    </label>
                                                </div>
                                            </Row>
                                            <Row className="mt-2">
                                                <div className="col-12 d-flex">
                                                    <label className="custom-toggle mt-2">
                                                        <input type="checkbox" name="onlyPrime"
                                                               id="onlyPrimeInput"/>
                                                        <span className="custom-toggle-slider rounded-circle"/>
                                                    </label>
                                                    <label htmlFor="onlyPrimeInput" className="mt-2 ml-2">
                                                        Prime
                                                    </label>
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

SearchEngine.propTypes = {};

export default SearchEngine;
