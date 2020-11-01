import Form from "reactstrap/es/Form";
import InputGroupAddon from "reactstrap/es/InputGroupAddon";
import InputGroupText from "reactstrap/es/InputGroupText";
import Input from "reactstrap/es/Input";
import InputGroup from "reactstrap/es/InputGroup";
import React, {useState} from "react";
import {withTranslation} from "react-i18next";

const SearchProductNavForm = props => {

    const { history, t} = props;

    const [searchText, setSearchText] = useState("");

    const onSubmit = e => {
        e.preventDefault();
        history.push("/search?keyWords=" + searchText);
    };

    return (
        <Form onSubmit={onSubmit}>
            <InputGroup className="input-group-alternative w-sm-100 w-md-75 mx-auto">
                <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                        <i className="fa fa-search" />
                    </InputGroupText>
                </InputGroupAddon>
                <Input className="form-control-alternative" placeholder={t("SEARCH_FOR_PRODUCT")} type="text"
                       defaultValue={searchText} onChange={e => setSearchText(e.target.value)} name="search"/>
            </InputGroup>
        </Form>
    )
};

export default withTranslation()(SearchProductNavForm);