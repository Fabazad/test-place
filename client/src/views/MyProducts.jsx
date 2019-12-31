import React from "react";

// reactstrap components
import {
    Badge,
    Card,
    CardHeader,
    CardFooter,
    Media,
    Table,
    Container,
    Row,
    UncontrolledTooltip
} from "reactstrap";
// core components
import Header from "../components/Headers/Header.jsx";
import productServices from '../services/product.service';
import userServices from '../services/user.services';
import {formatDate, textSlice} from "../helpers/textHelpers";
import {Link} from "react-router-dom";
import PaginationBis from "../components/PaginationBis";
import SearchEngine from "../components/SearchEngine";
import Loading from "../components/Loading";
import constants from "../helpers/constants";
import {updateURLParameter} from "../helpers/urlHelpers";
import NewProductModal from "../components/Modals/NewProductModal";
import DropdownSelect from "../components/DropdownSelect";

class MyProducts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            totalCount: 0,
            loading: false,
            page: 1
        };
    }

    componentDidMount() {
        this.findProducts();
    }

    findProducts() {
        const searchData = {
            seller: userServices.currentUserId
        };

        searchData.itemsPerPage = constants.ITEMS_PER_PAGE;
        searchData.page = this.state.page;

        this.setState({loading: true});
        productServices.find({searchData})
            .then(productSearch => this.setState({
                    products: productSearch.hits,
                    totalCount: productSearch.totalCount,
                    loading: false
                })
            );
    }

    goToPage(page) {
        let url = window.location.href;
        url = updateURLParameter(url, 'page', page);
        window.history.pushState({}, "", url);

        this.setState({page}, this.findProducts);
    }

    render() {
        return (
            <>
                <Header>
                    <div className="mt-5 mt-md-3">
                        <SearchEngine onSearch={() => this.findProducts()}/>
                    </div>
                </Header>
                {/* Page content */}
                <Container className="mt--7" fluid>
                    {/* Table */}
                    <Row>
                        <div className="col">
                            <Card className="shadow">
                                <CardHeader className="border-0">
                                    <h3 className="mb-0 d-inline-block mt-2">
                                        Mes Annonces Produits - {this.state.totalCount}
                                    </h3>
                                    <div className="float-right">
                                        <div className="d-inline-block">
                                            <NewProductModal onNewProduct={() => this.findProducts()}/>
                                        </div>
                                        <div className="d-inline-block w-200px ml-2">
                                            <DropdownSelect name={'sortBy'} options={constants.SORT_BY_OPTIONS}
                                                            placeholder={'Trier'}
                                                            onChange={() => this.findProducts()}/>
                                        </div>
                                    </div>
                                </CardHeader>
                                <div>
                                    <Loading loading={this.state.loading}/>
                                    <Table className="align-items-center table-flush" responsive>
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
                                        {
                                            this.state.products.map(product => (
                                                <tr key={'product' + product._id}>
                                                    <th scope="row">
                                                        <Media className="align-items-center">
                                                            <a
                                                                className="avatar rounded-circle mr-3"
                                                                href="#pablo"
                                                                onClick={e => e.preventDefault()}
                                                            >
                                                                <img className='shadow' alt="..."
                                                                     src={product.imageUrls[0].replace(/^(.+)(\.jpg)/, "$1._SS40_$2")}
                                                                />
                                                            </a>
                                                            <Media>
                                                            <span className="mb-0 text-sm">
                                                                {textSlice(product.title, 25)}
                                                            </span>
                                                            </Media>
                                                        </Media>
                                                    </th>
                                                    <th>
                                                        <h3><Badge color={'primary'}>{product.price}€</Badge></h3>
                                                    </th>
                                                    <th>
                                                        <h3><Badge
                                                            color={product.finalPrice > 0 ? 'warning' : 'success'}>
                                                            {product.finalPrice}€
                                                        </Badge></h3>
                                                    </th>
                                                    <th>
                                                        {
                                                            true ? (
                                                                <>
                                                                    <Badge color={'success'}
                                                                           className={'badge-circle badge-lg text-center p-0'}
                                                                           pill>
                                                                        <i className="ni ni-check-bold m-auto"/>
                                                                    </Badge>
                                                                    <span
                                                                        className="ml-2 text-muted">{formatDate(product.createdAt)}</span>
                                                                </>
                                                            ) : (
                                                                <Badge color={'danger'}
                                                                       className={'badge-circle badge-lg text-center p-0'}
                                                                       pill>
                                                                    <i className="ni ni-fat-remove m-auto ni-lg"/>
                                                                </Badge>
                                                            )
                                                        }
                                                    </th>
                                                    <td>0 / {product.maxDemands}</td>
                                                    <td>
                                                        <div className="avatar-group">
                                                            <div
                                                                className="cursor-pointer avatar avatar-sm bg-transparent">
                                                                <Badge pill className="badge-circle w-100 h-100"
                                                                       color={'danger'}
                                                                       tag={Link} to={'#'} id={"remove" + product._id}>
                                                                    <i className="fa fa-close m-auto fa-lg"/>
                                                                </Badge>
                                                                <UncontrolledTooltip
                                                                    delay={0}
                                                                    target={"remove" + product._id}
                                                                >
                                                                    Supprimer
                                                                </UncontrolledTooltip>
                                                            </div>
                                                            <div
                                                                className="cursor-pointer avatar avatar-sm bg-transparent">
                                                                <Badge pill
                                                                       className="badge-circle w-100 h-100"
                                                                       color={'warning'}
                                                                       tag={Link} to={'#'} id={"edit" + product._id}>
                                                                    <i className="fa fa-edit m-auto fa-lg"/>
                                                                </Badge>
                                                                <UncontrolledTooltip
                                                                    delay={0}
                                                                    target={"edit" + product._id}
                                                                >
                                                                    Editer
                                                                </UncontrolledTooltip>
                                                            </div>
                                                            <div
                                                                className="cursor-pointer avatar avatar-sm bg-transparent">
                                                                <Badge pill
                                                                       className="badge-circle w-100 h-100"
                                                                       color={'info'}
                                                                       tag={Link} to={'/ad/' + product._id}
                                                                       id={"see" + product._id}>
                                                                    <i className="fa fa-eye m-auto fa-lg"/>
                                                                </Badge>
                                                                <UncontrolledTooltip
                                                                    delay={0}
                                                                    target={"see" + product._id}
                                                                >
                                                                    Voir
                                                                </UncontrolledTooltip>
                                                            </div>
                                                            <div
                                                                className="cursor-pointer avatar avatar-sm bg-transparent">
                                                                <Badge pill
                                                                       className="badge-circle w-100 h-100"
                                                                       color={'primary'}
                                                                       tag={Link} to={'#'} id={"upgrade" + product._id}>
                                                                    <i className="fa fa-diamond m-auto fa-lg"/>
                                                                </Badge>
                                                                <UncontrolledTooltip
                                                                    delay={0}
                                                                    target={"upgrade" + product._id}
                                                                >
                                                                    Upgrade
                                                                </UncontrolledTooltip>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        }

                                        </tbody>
                                    </Table>
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
