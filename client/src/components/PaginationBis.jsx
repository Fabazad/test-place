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
        const {page, totalPage} = this.props;
        return (
            <>
                <nav aria-label="...">
                    <Pagination className={"justify-content-center"} listClassName="justify-content-center">
                        <PaginationItem onClick={() => this.onPageClick(this.props.page - 1)}
                                        className={this.props.page === 1 ? 'disabled' : ''}>
                            <PaginationLink onClick={e => e.preventDefault()} tabIndex="-1">
                                <i className="fa fa-angle-left"/>
                                <span className="sr-only">Previous</span>
                            </PaginationLink>
                        </PaginationItem>

                        {page > 1 ? (
                            <PaginationItem onClick={() => this.onPageClick(1)}>
                                <PaginationLink onClick={e => e.preventDefault()}>1</PaginationLink>
                            </PaginationItem>
                        ) : null}

                        {page > 4 ? (
                            <PaginationItem onClick={() => this.onPageClick(page - 3)}>
                                <PaginationLink onClick={e => e.preventDefault()}>...</PaginationLink>
                            </PaginationItem>
                        ) : null}

                        {page > 3 ? (
                            <PaginationItem onClick={() => this.onPageClick(page - 2)}>
                                <PaginationLink onClick={e => e.preventDefault()}>{ page - 2 }</PaginationLink>
                            </PaginationItem>
                        ) : null}

                        {page > 2 ? (
                            <PaginationItem onClick={() => this.onPageClick(page - 1)}>
                                <PaginationLink onClick={e => e.preventDefault()}>{ page - 1 }</PaginationLink>
                            </PaginationItem>
                        ) : null}

                        <PaginationItem className="active">
                            <PaginationLink onClick={e => e.preventDefault()}>{page}</PaginationLink>
                        </PaginationItem>

                        {page < totalPage - 1 ? (
                            <PaginationItem onClick={() => this.onPageClick(page + 1)}>
                                <PaginationLink onClick={e => e.preventDefault()}>{ page + 1 }</PaginationLink>
                            </PaginationItem>
                        ) : null}

                        {page < totalPage - 2 ? (
                            <PaginationItem onClick={() => this.onPageClick(page + 2)}>
                                <PaginationLink onClick={e => e.preventDefault()}>{ page + 2 }</PaginationLink>
                            </PaginationItem>
                        ) : null}

                        {page < totalPage - 3 ? (
                            <PaginationItem onClick={() => this.onPageClick(page + 3)}>
                                <PaginationLink onClick={e => e.preventDefault()}>...</PaginationLink>
                            </PaginationItem>
                        ) : null}

                        {page !== totalPage && totalPage !== 0 ? (
                            <PaginationItem onClick={() => this.onPageClick(totalPage)}>
                                <PaginationLink onClick={e => e.preventDefault()}>{ totalPage }</PaginationLink>
                            </PaginationItem>
                        ) : null}

                        <PaginationItem onClick={() => this.onPageClick(this.props.page + 1)}
                                        className={this.props.page >= this.props.totalPage ? 'disabled' : ''}>
                            <PaginationLink onClick={e => e.preventDefault()}>
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