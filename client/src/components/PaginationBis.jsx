import React from "react";
// reactstrap components
import {
    PaginationItem,
    PaginationLink,
    Pagination
} from "reactstrap";
import PropTypes from "prop-types";

class PaginationBis extends React.Component {

    onPageClick(page) {
        if (page !== this.props.page && page > 0 && page <= this.props.totalPage) {
            this.props.onPageClick(page);
        }
    }

    render() {
        return (
            <>
                <nav aria-label="...">
                    <Pagination className={"justify-content-center"} listClassName="justify-content-center">
                        <PaginationItem onClick={() => this.onPageClick(this.props.page - 1)}
                                        className={this.props.page === 1 ? 'disabled' : ''}>
                            <PaginationLink
                                onClick={e => e.preventDefault()}
                                tabIndex="-1"
                            >
                                <i className="fa fa-angle-left"/>
                                <span className="sr-only">Previous</span>
                            </PaginationLink>
                        </PaginationItem>

                        {
                            Array.from(Array(this.props.totalPage), (x, i) => (
                                <PaginationItem className={(i + 1 === this.props.page) ? "active" : ''} key={'page' + i}
                                                onClick={() => this.onPageClick(i + 1)}>
                                    <PaginationLink href="#pablo" onClick={e => e.preventDefault()}>
                                        {i + 1} <span className="sr-only">(current)</span>
                                    </PaginationLink>
                                </PaginationItem>
                            ))
                        }

                        <PaginationItem onClick={() => this.onPageClick(this.props.page + 1)}
                                        className={this.props.page >= this.props.totalPage ? 'disabled' : ''}>
                            <PaginationLink href="#pablo" onClick={e => e.preventDefault()}>
                                <i className="fa fa-angle-right"/>
                                <span className="sr-only">Next</span>
                            </PaginationLink>
                        </PaginationItem>

                    </Pagination>
                </nav>
            </>
        );
    }
}

PaginationBis.propTypes = {
    page: PropTypes.number.isRequired,
    totalPage: PropTypes.number.isRequired,
    onPageClick: PropTypes.func.isRequired
};

export default PaginationBis;