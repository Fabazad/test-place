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
import {updateURLParameter} from "../helpers/urlHelpers"
import ProductCard from "../components/ProductCard";
import constants from "../helpers/constants";
import PaginationBis from "../components/PaginationBis";
import DropdownSelect from "../components/DropdownSelect";

class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            validate: null,
            searchEngineData: {},
            products: [null, null, null, null],
            totalCount: 0,
            page: 1,
            sortBy: constants.SORT_BY_OPTIONS[0].value
        };
        this.onSearch = this.onSearch.bind(this);
        this.searchProducts = this.searchProducts.bind(this);
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
        searchEngineData.page = this.state.searchEngineData.page;
        this.setState({searchEngineData}, this.searchProducts);
    }

    onSearch(searchData) {
        let url = window.location.href;

        Object.keys(searchData).forEach(dataKey => {
            url = updateURLParameter(url, dataKey, searchData[dataKey]);
        });
        window.history.pushState({}, "", url);

        this.setState({searchEngineData: searchData, page: 1}, () => this.goToPage(1));
    }

    searchProducts() {
        const searchData = this.state.searchEngineData;
        searchData.itemsPerPage = constants.ITEMS_PER_PAGE;
        searchData.sortBy = this.state.sortBy;
        searchData.page = this.state.page;
        searchData.published = true;
        this.setState({products: this.state.products.map(() => null)});
        productServices.find({searchData}).then(products => {
            this.setState({products: products.hits, totalCount: products.totalCount});
        });

    }

    goToPage(page) {
        let url = window.location.href;
        url = updateURLParameter(url, 'page', page);
        window.history.pushState({}, "", url);
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        this.refs.main.scrollTop = 0;
        this.setState({page}, this.searchProducts);
    }

    onSortByChange(sortBy) {
        this.setState({sortBy}, () => {
            let url = window.location.href;
            url = updateURLParameter(url, 'sortBy', sortBy);
            window.history.pushState({}, "", url);
            this.goToPage(1);
        });
    }

    render() {
        return (
            <>
                <main ref="main">
                    <section className="section section-shaped section-lg">
                        <div className="shape shape-style-1 bg-gradient-default">
                            <span/>
                            <span/>
                            <span/>
                            <span/>
                            <span/>
                            <span/>
                            <span/>
                            <span/>
                        </div>
                        <Container className="pt-lg-md mb-5">
                            <Row className="mt-3">
                                <div className="col-12">
                                    <SearchEngine onSearch={this.onSearch} data={this.state.searchEngineData}/>
                                </div>
                            </Row>
                            <Row className="mt-5">
                                <div className="col-12 col-md-8 col-lg-9">
                                    <h2 className="text-secondary display-4">
                                        {this.state.totalCount} Résultat{this.state.totalCount > 1 ? 's' : ''}
                                    </h2>
                                </div>
                                <div className="col-12 col-md-4 col-lg-3 text-right">
                                    <DropdownSelect name={'sortBy'} options={constants.SORT_BY_OPTIONS}
                                                    onChange={e => this.onSortByChange(e.target.value)}
                                                    value={this.state.sortBy} placeholder={'Trier le Résultat'}/>
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
                            <Loading loading={this.state.loading}/>
                            <Row>
                                {
                                    this.state.products.map(product => (
                                        <div className="col-12 col-md-6 col-lg-4 col-xl-3 my-2"
                                             key={product ? product._id : Math.ceil(Math.random() * 1000)}>
                                            <ProductCard product={product}/>
                                        </div>

                                    ))
                                }
                            </Row>
                        </Container>
                    </section>
                    <section>
                        <Container>
                            <Row>
                                <div className="col-12">
                                    <PaginationBis page={this.state.page}
                                                   onPageClick={page => this.goToPage(page)}
                                                   totalPage={Math.ceil(this.state.totalCount / constants.ITEMS_PER_PAGE)}/>
                                </div>
                            </Row>
                        </Container>
                    </section>
                </main>
                <SimpleFooter/>
            </>
        );
    }
}

export default Search;
