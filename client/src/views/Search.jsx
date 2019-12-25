import React from "react";

// reactstrap components
import {
    Container,
    Row
} from "reactstrap";

// core components
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import userServices from "services/user.services";
import SearchEngine from "../components/SearchEngine";


class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingPromise: null,
            validate: null
        }
    }

    componentDidMount() {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        this.refs.main.scrollTop = 0;
    }

    render() {
        return (
            <>
                <main ref="main">
                    <section className="section section-shaped section-lg">
                        <div className="shape shape-style-1 bg-gradient-default">
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                        </div>
                        <Container className="pt-lg-md">
                            <Row>
                                <div className="col-12">
                                    <SearchEngine/>
                                </div>
                            </Row>
                        </Container>
                    </section>
                    <section className="section section-lg">
                        <Container>
                            Big
                        </Container>
                    </section>
                </main>
                <SimpleFooter />
            </>
        );
    }
}

export default Search;
