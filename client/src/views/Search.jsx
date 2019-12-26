import React from "react";

// reactstrap components
import {
    Container,
    Row
} from "reactstrap";

// core components
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import SearchEngine from "../components/SearchEngine";
import productServices from "../services/product.service";
import Loading from "../components/Loading";
import { updateURLParameter } from "../helpers/urlHelpers"
import ProductCard from "../components/ProductCard";

class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingPromise: null,
            validate: null,
            searchEngineData: {},
            products: []
        };
        this.onSearch = this.onSearch.bind(this);
    }

    componentDidMount() {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        this.refs.main.scrollTop = 0;

        const urlParams = new URLSearchParams(window.location.search);
        const searchEngineData = {
            minPrice: urlParams.has('minPrice') ? urlParams.get('minPrice') : '',
            maxPrice: urlParams.has('maxPrice') ? urlParams.get('maxPrice') : '',
            free: urlParams.get('free') === 'true',
            automaticAcceptance: urlParams.get('automaticAcceptance') === 'true',
            prime: urlParams.get('prime') === 'true',
            category: urlParams.has('category') ? urlParams.get('category') : '',
            keyWords: urlParams.has('keyWords') ? urlParams.get('keyWords') : ''
        };
        this.setState({ searchEngineData });
        this.searchProducts(searchEngineData);
    }

    onSearch(searchData) {
        let url = window.location.href;
        this.setState({ searchEngineData: searchData });
        Object.keys(searchData).forEach(dataKey => {
            url = updateURLParameter(url, dataKey, searchData[dataKey]);
        });
        window.history.pushState({},"", url);
        this.searchProducts(searchData);
    }

    searchProducts(searchData) {
        const loadingPromise = productServices.find({searchData}).then(products => {
            this.setState({ products })
            console.log(products);
        });
        this.setState({ loadingPromise });
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
                        <Container className="pt-lg-md mb-5">
                            <Row className="mt-3">
                                <div className="col-12 mb-5">
                                    <SearchEngine onSearch={this.onSearch} data={this.state.searchEngineData}/>
                                </div>
                            </Row>
                        </Container>
                        <div className="separator separator-bottom separator-skew">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                preserveAspectRatio="none"
                                version="1.1"
                                viewBox="0 0 2560 100"
                                x="0"
                                y="0"
                                className={"w-100"}
                            >
                                <polygon
                                    className="fill-secondary"
                                    points="2560 0 2560 100 0 100"
                                />
                            </svg>
                        </div>
                    </section>
                    <section className="section section-lg pt-0 mt--100">
                        <Container>
                            <Loading promise={this.state.loadingPromise}/>
                            <Row>
                                {
                                    this.state.products.map(product => (
                                        <div className="col-12 col-md-6 col-lg-4 col-xl-3 my-2" key={product._id}>
                                            <ProductCard product={product}/>
                                        </div>

                                    ))
                                }
                            </Row>
                        </Container>
                    </section>
                </main>
                <SimpleFooter />
            </>
        );
    }
}

export default Search;
