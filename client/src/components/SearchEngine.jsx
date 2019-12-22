import React from "react";
import '../assets/scss/animated-checks.scss';
import PropTypes from "prop-types";
import { Form, FormGroup, Input, Row, Button, UncontrolledTooltip } from "reactstrap";

class SearchEngine extends React.Component {

    render() {
        const style = this.props.style || {};
        const className = this.props.className || "";
        return (
            <>
                <Form className="p-4 rounded bg-translucent-light">
                    <Row>
                        <div className="col-md-3 text-center col-12">
                            <FormGroup className="mb-md-0">
                                <Input type="select" className="form-control-alternative">
                                    <option value={null}>Catégories</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Input>
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
                            </FormGroup>
                        </div>
                        <div className="col-md-3 text-center col-12">
                            <FormGroup className="mb-0">
                                <Button type="submit" color={"primary"} className="w-100">
                                    <i className="fa fa-search" />
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
