import React, {useEffect} from "react";
import {withTranslation} from 'react-i18next';
// nodejs library that concatenates classes

// reactstrap components
import {
    Container,
    Row,
    Col
} from "reactstrap";

// core components

// index page sections
import SearchEngine from "../../components/SearchEngine";
import {updateURLParameters} from "../../helpers/urlHelpers";
import ProductDisplay from "./ProductDisplay";
import MarketingCards from "./MarketingCards";
import UISection from "./FreeProducts";
import CommunityCard from "./CommunityCard";
import ContactSections from "./ContactSections";
import SimpleFooter from "../../components/Footers/SimpleFooter";
import {scrollTo} from "../../helpers/scrollHelpers";
import TestProcess from "./TestProcess";

const Landing = (props) => {
    const {location, t} = props

    useEffect(() => {
        if (location.hash) {
            setTimeout(() => {
                scrollTo(location.hash.slice(1));
            }, 200);
        } else {
            document.documentElement.scrollTop = 0;
            document.scrollingElement.scrollTop = 0;
        }
    }, [location]);

    const onSearch = (searchData) => {
        updateURLParameters(searchData, "/search");
    }

    return (
        <>
            <main>
                <div className="position-relative">
                    {/* shape Hero */}
                    <section className="section section-lg section-shaped pb-250">
                        <div className="shape shape-style-1 shape-default">
                            <span/>
                            <span/>
                            <span/>
                            <span/>
                            <span/>
                            <span/>
                            <span/>
                            <span/>
                            <span/>
                        </div>
                        <Container className="py-lg-4">
                            <Row>
                                <Col lg="12 text-center">
                                    <h1 className="display-4 text-white">
                                        <span>{t("LANDING_PAGE_TITLE_1")}</span>
                                    </h1>
                                    <h1 className="display-4 text-white">
                                        <span>{t("LANDING_PAGE_TITLE_2")}</span>
                                    </h1>
                                </Col>
                            </Row>
                            <Row className="mt-5">
                                <Col className="p-4 rounded bg-translucent-light">
                                    <SearchEngine onSearch={onSearch} data={{}} lean/>
                                </Col>
                            </Row>
                        </Container>
                        {/* SVG separator */}
                        <div className="separator separator-bottom separator-skew">
                            <svg
                                className='w-100'
                                xmlns="http://www.w3.org/2000/svg"
                                preserveAspectRatio="none"
                                version="1.1"
                                viewBox="0 0 2560 100"
                                x="0"
                                y="0"
                            >
                                <polygon
                                    className="fill-secondary"
                                    points="2560 0 2560 100 0 100"
                                />
                            </svg>
                        </div>
                    </section>
                    {/* 1st Hero Variation */}
                </div>
                <section className="section section-lg mt--200 mt--60px pt-0 pb-5">
                    <ProductDisplay/>
                </section>
                <section className="section section-lg py-5 my-3 bg-gradient-success" id="how-it-works">
                    <TestProcess/>
                    <MarketingCards/>
                </section>
                <section className="section section-lg" id="free-products">
                    <UISection/>
                </section>
                <section className="section section-lg pt-0">
                    <Container>
                        <CommunityCard/>
                    </Container>
                </section>

                <ContactSections/>
            </main>

            <SimpleFooter/>
        </>
    );
};

export default withTranslation()(Landing);
