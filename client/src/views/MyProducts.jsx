import React from "react";

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

class MyProducts extends React.Component {

    _isMount = true;

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            totalCount: 0,
            loading: false,
            page: 1,
            sortBy: null
        };
    }

    componentDidMount() {
        productServices.productsUpdatedSubject.subscribe(() => this.findProducts());
        productServices.productsUpdatedSubject.next();
    }

    componentWillUnmount() {
        this._isMount = false;
    }

    findProducts() {
        if (!this._isMount) {
            return;
        }
        const searchData = {
            seller: userServices.getCurrentUserId()
        };

        searchData.itemsPerPage = constants.ITEMS_PER_PAGE;
        searchData.page = this.state.page;
        searchData.sortBy = this.state.sortBy;

        this.setState({loading: true});
        productServices.find({searchData})
            .then(productSearch => this.setState({
                    products: productSearch.hits,
                    totalCount: productSearch.totalCount,
                    loading: false
                })
            );
    }

    onSortChange(e) {
        const sortBy = e.target.value;
        this.setState({sortBy}, () => {
            updateURLParameters({sortBy, page: 1});
            this.setState({page: 1}, this.findProducts);
        });
    }

    goToPage(page) {
        updateURLParameters({page});

        this.setState({page}, this.findProducts);
    }

    render() {
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
                                            <h4 className="m-0">{this.state.totalCount}</h4>
                                        </Badge>
                                    </h3>
                                    <div className="float-right text-center">
                                        <div className="d-inline-block my-2 my-md-0">
                                            <NewProductModal onNewProduct={() => this.findProducts()}/>
                                        </div>
                                        <div className="d-inline-block w-200px my-2 ml-2 my-md-0">
                                            <DropdownSelect
                                                name={'sortBy'} options={constants.SORT_BY_OPTIONS}
                                                placeholder={'Trier'} value={this.state.sortBy}
                                                onChange={(e) => this.onSortChange(e)}/>
                                        </div>
                                    </div>
                                </CardHeader>
                                <Table className="align-items-center table-flush d-none d-lg-table" responsive>
                                    <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Produit</th>
                                        <th scope='col'>Prix</th>
                                        <th scope='col'>Final</th>
                                        <th scope="col">Publication</th>
                                        <th scope="col">
                                            <span id='demandsColumn' data-placement='top'>Demandes</span>
                                            <UncontrolledTooltip
                                                delay={0}
                                                target='demandsColumn'
                                                placement="top"
                                            >
                                                Nombre de Demandes Reçues / Nombre de Demande Max
                                            </UncontrolledTooltip>
                                        </th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.products.map(product => (
                                        <ProductRow product={product} key={'product' + product._id} />
                                    ))}
                                    </tbody>
                                </Table>
                                <div className="container d-block d-lg-none">
                                    <div className="row">
                                        {this.state.products.map(product => (
                                            <div className="col-12 col-md-6 my-2" key={"productCard" + product._id}>
                                                <MyProductCard product={product}/>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <CardFooter className="py-4">
                                    <nav aria-label="...">
                                        <PaginationBis page={this.state.page}
                                                       totalPage={Math.ceil(this.state.totalCount / constants.ITEMS_PER_PAGE)}
                                                       onPageClick={page => this.goToPage(page)}/>
                                    </nav>
                                </CardFooter>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </>
        );
    }
}

export default MyProducts;
