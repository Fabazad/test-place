import React, {useEffect, useState} from "react";

// reactstrap components
import {
    Container,
    Row
} from "reactstrap";

// core components
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import SearchEngine from "../components/SearchEngine";
import productServices from "../services/product.service";
import {updateURLParameter} from "../helpers/urlHelpers"
import ProductCard from "../components/Cards/ProductCard";
import constants from "../helpers/constants";
import PaginationBis from "../components/PaginationBis";
import DropdownSelect from "../components/DropdownSelect";
import {scrollTo} from "../helpers/scrollHelpers";
import ProductCardSkeleton from "../components/Cards/ProductCardSkeleton";

const Search = () => {

    const [loading, setLoading] = useState(false);
    const [searchEngineData, setSearchEngineData] = useState({});
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState(constants.SORT_BY_OPTIONS[0].value);
    const itemsPerPage = constants.ITEMS_PER_PAGE;
    const [products, setProducts] = useState(null);

    const getSearchParamsFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        setSearchEngineData({
            minPrice: urlParams.has('minPrice') ? urlParams.get('minPrice') : '',
            maxPrice: urlParams.has('maxPrice') ? urlParams.get('maxPrice') : '',
            free: urlParams.get('free') === 'true',
            automaticAcceptance: urlParams.get('automaticAcceptance') === 'true',
            prime: urlParams.get('prime') === 'true',
            category: urlParams.has('category') ? urlParams.get('category') : '',
            keyWords: urlParams.has('keyWords') ? urlParams.get('keyWords') : '',
        });
    };

    useEffect(getSearchParamsFromUrl, []);

    useEffect(() => {

        setTimeout(() => scrollTo("results"), 100);
        searchProducts();
    }, [searchEngineData, page, sortBy]);

    const onSearch = (searchData) => {
        let url = window.location.href;

        Object.keys(searchData).forEach(dataKey => {
            url = updateURLParameter(url, dataKey, searchData[dataKey]);
        });
        window.history.pushState({}, "", url);

        setSearchEngineData(searchData);
        goToPage(1);
    };

    const searchProducts = () => {
        setLoading(true);

        const searchData = {
            ...searchEngineData,
            itemsPerPage,
            sortBy,
            page,
            published: true,
            remainingRequests: true
        };

        productServices.find({searchData}).then(products => {
            setProducts(products.hits);
            setTotalCount(products.totalCount);
            setLoading(false);
        });

    };

    const goToPage = page => {
        let url = window.location.href;
        url = updateURLParameter(url, 'page', page);
        window.history.pushState({}, "", url);
        setPage(page);
    };

    const onSortByChange = sortBy => {
        setSortBy(sortBy);
        let url = window.location.href;
        url = updateURLParameter(url, 'sortBy', sortBy);
        window.history.pushState({}, "", url);
        goToPage(1);
    };

    return (
        <>
            <main>
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
                                <SearchEngine onSearch={onSearch} data={searchEngineData}/>
                            </div>
                        </Row>
                        <Row className="pt-5" id="results">
                            <div className="col-12 col-md-8 col-lg-9">
                                <h2 className="text-secondary display-4">
                                    {totalCount} Résultat{totalCount > 1 ? 's' : ''}
                                </h2>
                            </div>
                            <div className="col-12 col-md-4 col-lg-3 text-right">
                                <DropdownSelect name={'sortBy'} options={constants.SORT_BY_OPTIONS}
                                                onChange={e => onSortByChange(e.target.value)}
                                                value={sortBy} placeholder={'Trier le Résultat'}/>
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
                        <Row>
                            {!loading && products && products.length && products.map(product => (
                                <div className="col-12 col-md-6 col-lg-4 col-xl-3 my-2"
                                     key={product ? product._id : Math.ceil(Math.random() * 1000)}>
                                    <ProductCard product={product}/>
                                </div>
                            ))}

                            {loading && (new Array(itemsPerPage)).fill(null).map((product, index) => (
                                <div className="col-12 col-md-6 col-lg-4 col-xl-3 my-2" key={index}>
                                    <ProductCardSkeleton/>
                                </div>
                            ))}
                        </Row>
                    </Container>
                </section>
                <section>
                    <Container>
                        <Row>
                            <div className="col-12">
                                <PaginationBis page={page} onPageClick={goToPage}
                                               totalPage={Math.ceil(totalCount / itemsPerPage)}/>
                            </div>
                        </Row>
                    </Container>
                </section>
            </main>
            <SimpleFooter/>
        </>
    );
};

export default Search;
