import React from "react";

// reactstrap components
import {
    Container,
    Row
} from "reactstrap";

// core components
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import SearchEngine from "../components/SearchEngine";


class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingPromise: null,
            validate: null,
            searchEngineData: {}
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
    }

    updateURLParameter(url, param, paramVal) {
        let newAdditionalURL = "";
        let tempArray = url.split("?");
        let baseURL = tempArray[0];
        let additionalURL = tempArray[1];
        let temp = "";
        if (additionalURL) {
            tempArray = additionalURL.split("&");
            for (let i=0; i<tempArray.length; i++){
                if(tempArray[i].split('=')[0] !== param){
                    newAdditionalURL += temp + tempArray[i];
                    temp = "&";
                }
            }
        }

        const rows_txt = temp + "" + param + "=" + paramVal;
        return baseURL + "?" + newAdditionalURL + rows_txt;
    }

    onSearch(searchData) {
        let url = window.location.href;
        Object.keys(searchData).forEach(dataKey => {
            url = this.updateURLParameter(url, dataKey, searchData[dataKey]);
        });

        window.history.pushState({},"", url);
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
                                    <SearchEngine onSearch={this.onSearch} data={this.state.searchEngineData}/>
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
