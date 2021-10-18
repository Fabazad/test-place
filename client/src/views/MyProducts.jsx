import React, {useEffect, useState} from "react";

// reactstrap components
import {
    Card,
    CardHeader,
    CardFooter,
    Table,
    Container,
    Row,
    UncontrolledTooltip
} from "reactstrap";
// core components
import Header from "../components/Headers/Header.jsx";
import productServices from '../services/product.service';
import userServices from '../services/user.services';
import PaginationBis from "../components/PaginationBis";
import constants from "../helpers/constants";
import {updateURLParameters} from "../helpers/urlHelpers";
import NewProductModal from "../components/Modals/NewProductModal";
import DropdownSelect from "../components/DropdownSelect";
import ProductRow from "../components/Rows/ProductRow.jsx";
import MyProductCard from "../components/Cards/MyProductCard";
import Badge from "reactstrap/es/Badge";
import Loading from "../components/Loading";
import {withTranslation} from "react-i18next";

const MyProducts = props => {

    const { t } = props;

    const [products, setProducts] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState(null);

    useEffect(() => {
        const subscriber = productServices.productsUpdatedSubject.subscribe(() => findProducts());
        return () => subscriber.unsubscribe();
    }, []);

    const findProducts = () => {
        const searchData = {
            seller: userServices.getCurrentUserId()
        };

        searchData.itemsPerPage = constants.ITEMS_PER_PAGE;
        searchData.page = page;
        searchData.sortBy = sortBy;

        setLoading(true);
        productServices.find({searchData})
            .then(productSearch => {
                setProducts(productSearch.hits);
                setTotalCount(productSearch.totalCount);
                setLoading(false);
            });
    };

    useEffect(() => {
        findProducts();
    }, [sortBy, page]);

    const onSortChange = (e) => {
        const sortBy = e.target.value;
        setSortBy(e.target.value);
        updateURLParameters({sortBy, page: 1});
        setPage(1);
    };

    const goToPage = (page) => {
        updateURLParameters({page});
        setPage(page);
    };

    return (
        <>
            <Header>
                <div className="py-3"></div>
            </Header>
            {/* Page content */}
            <Container className="mt--7" fluid>
                {/* Table */}
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0 d-inline-block mt-2">
                                    Mes Annonces Produits
                                    <Badge color="primary" pill className="ml-3 badge-circle">
                                        <h4 className="m-0">{totalCount}</h4>
                                    </Badge>
                                </h3>
                                <div className="float-right text-center">
                                    <div className="d-inline-block my-2 my-md-0">
                                        <NewProductModal onNewProduct={findProducts}/>
                                    </div>
                                    <div className="d-inline-block w-200px my-2 ml-2 my-md-0">
                                        <DropdownSelect
                                            name={'sortBy'} options={constants.SORT_BY_OPTIONS(t)}
                                            placeholder={t('SORT')} value={sortBy}
                                            onChange={onSortChange}/>
                                    </div>
                                </div>
                            </CardHeader>
                            <Table className="align-items-center table-flush d-none d-lg-table position-relative" responsive>
                                <Loading loading={loading}/>
                                <thead className="thead-light">
                                <tr>
                                    <th scope="col">{t("PRODUCT")}</th>
                                    <th scope='col'>{t("PRICE")}</th>
                                    <th scope='col'>{t("FINAL")}</th>
                                    <th scope="col">{t("PUBLISHED")}</th>
                                    <th scope="col">
                                        <span id='demandsColumn' data-placement='top'>{t("REQUESTS")}</span>
                                        <UncontrolledTooltip delay={0} target='demandsColumn' placement="top">
                                            {t("RECEIVED_ON_MAX_REQUESTS")}
                                        </UncontrolledTooltip>
                                    </th>
                                    <th scope="col">{t("ACTIONS")}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {products.map(product => (
                                    <ProductRow product={product} key={'product' + product._id}/>
                                ))}
                                </tbody>
                            </Table>
                            <div className="container d-block d-lg-none">
                                <Loading loading={loading}/>
                                <div className="row">
                                    {products.map(product => (
                                        <div className="col-12 col-md-6 my-2" key={"productCard" + product._id}>
                                            <MyProductCard product={product}/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <CardFooter className="py-4">
                                <nav aria-label="...">
                                    <PaginationBis page={page}
                                                   totalPage={Math.ceil(totalCount / constants.ITEMS_PER_PAGE)}
                                                   onPageClick={goToPage}/>
                                </nav>
                            </CardFooter>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
};

export default withTranslation()(MyProducts);
