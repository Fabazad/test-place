import React from "react";
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
import UISection from "./UISection";
import CommunityCard from "./CommunityCard";
import ContactSections from "./ContactSections";
import SimpleFooter from "../../components/Footers/SimpleFooter";
import {scrollTo} from "../../helpers/scrollHelpers";

class Landing extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.onSearch = this.onSearch.bind(this);
    }

    componentDidMount() {
        if (this.props.location.hash) {
            setTimeout(() => {
                scrollTo(this.props.location.hash.slice(1));
            }, 200);
        } else {
            document.documentElement.scrollTop = 0;
            document.scrollingElement.scrollTop = 0;
            this.refs.main.scrollTop = 0;
        }
    }

    onSearch(searchData) {
        updateURLParameters(searchData, "/search");
    }

    render() {
        return (
            <>
                <main ref="main">
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
                                        <h1 className="display-3 text-white">Test Place</h1>
                                        <h1 className="display-4 text-white">
                                            <span>Testez gratuitement des produits Amazon</span>
                                        </h1>
                                        <img src={require("assets/img/brand/logo_test_place.png")}
                                             style={{height: "150px"}} alt="test place logo" className="my-3 floating"/>
                                    </Col>
                                </Row>
                                <Row className="mt-5">
                                    <Col>
                                        <SearchEngine onSearch={this.onSearch} data={{}}/>
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
                    <section className="section section-lg py-5 my-3 bg-gradient-success">
                        <MarketingCards/>
                    </section>
                    <section className="section section-lg">
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
    }
}

export default Landing;
