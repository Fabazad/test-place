import React from "react";

// reactstrap components
import {
    Badge,
    Card,
    CardHeader,
    CardFooter,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    Pagination,
    PaginationItem,
    PaginationLink,
    Progress,
    Table,
    Container,
    Row,
    UncontrolledTooltip
} from "reactstrap";
// core components
import Header from "../components/Headers/Header.jsx";
import productServices from '../services/product.service';
import userServices from '../services/user.services';
import {textSlice} from "../helpers/textHelpers";
import {Link} from "react-router-dom";
import PaginationBis from "../components/PaginationBis";

class MyProducts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            totalCount: 0
        };
    }

    componentDidMount() {
        const searchData = {
            seller: userServices.currentUserId
        };
        productServices.find({searchData})
            .then(productSearch => this.setState({
                    products: productSearch.hits,
                    totalCount: productSearch.totalCount
                })
            );
    }

    render() {
        return (
            <>
                <Header>
                    hey
                </Header>
                {/* Page content */}
                <Container className="mt--7" fluid>
                    {/* Table */}
                    <Row>
                        <div className="col">
                            <Card className="shadow">
                                <CardHeader className="border-0">
                                    <h3 className="mb-0">Mes Produits</h3>
                                </CardHeader>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Produit</th>
                                        <th scope="col">Nb Demandes</th>
                                        <th scope="col">Restantes</th>
                                        <th scope="col">Action</th>
                                        <th scope="col">Completion</th>
                                        <th scope="col"/>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.products.map(product => (
                                            <tr>
                                                <th scope="row">
                                                    <Media className="align-items-center">
                                                        <a
                                                            className="avatar rounded-circle mr-3"
                                                            href="#pablo"
                                                            onClick={e => e.preventDefault()}
                                                        >
                                                            <img
                                                                className='shadow'
                                                                alt="..."
                                                                src={product.imageUrls[0].replace(/^(.+)(\.jpg)/, "$1._SS40_$2")}
                                                            />
                                                        </a>
                                                        <Media>
                                                            <span className="mb-0 text-sm">
                                                                {textSlice(product.title, 20)}
                                                            </span>
                                                        </Media>
                                                    </Media>
                                                </th>
                                                <td>0</td>
                                                <td>{product.maxDemands}</td>
                                                <td>
                                                    <div className="avatar-group">
                                                        <div className="cursor-pointer avatar avatar-sm bg-transparent">
                                                            <Badge pill
                                                                   className="badge-circle w-100 h-100"
                                                                   color={'danger'}
                                                                   tag={Link} to={'#'} id={"remove"+product._id}>
                                                                <i className="fa fa-close m-auto fa-lg"/>
                                                            </Badge>
                                                            <UncontrolledTooltip
                                                                delay={0}
                                                                target={"remove"+product._id}
                                                            >
                                                                Supprimer
                                                            </UncontrolledTooltip>
                                                        </div>
                                                        <div className="cursor-pointer avatar avatar-sm bg-transparent">
                                                            <Badge pill
                                                                   className="badge-circle w-100 h-100"
                                                                   color={'warning'}
                                                                   tag={Link} to={'#'} id={"edit"+product._id}>
                                                                <i className="fa fa-edit m-auto fa-lg"/>
                                                            </Badge>
                                                            <UncontrolledTooltip
                                                                delay={0}
                                                                target={"edit"+product._id}
                                                            >
                                                                Editer
                                                            </UncontrolledTooltip>
                                                        </div>
                                                        <div className="cursor-pointer avatar avatar-sm bg-transparent">
                                                            <Badge pill
                                                                   className="badge-circle w-100 h-100"
                                                                   color={'primary'}
                                                                   tag={Link} to={'#'} id={"upgrade"+product._id}>
                                                                <i className="fa fa-diamond m-auto fa-lg"/>
                                                            </Badge>
                                                            <UncontrolledTooltip
                                                                delay={0}
                                                                target={"upgrade"+product._id}
                                                            >
                                                                Upgrade
                                                            </UncontrolledTooltip>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <span className="mr-2">60%</span>
                                                        <div>
                                                            <Progress
                                                                max="100"
                                                                value="60"
                                                                barClassName="bg-danger"
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-right">
                                                    <UncontrolledDropdown>
                                                        <DropdownToggle
                                                            className="btn-icon-only text-light"
                                                            href="#pablo"
                                                            role="button"
                                                            size="sm"
                                                            color=""
                                                            onClick={e => e.preventDefault()}
                                                        >
                                                            <i className="fas fa-ellipsis-v"/>
                                                        </DropdownToggle>
                                                        <DropdownMenu className="dropdown-menu-arrow" right>
                                                            <DropdownItem
                                                                href="#pablo"
                                                                onClick={e => e.preventDefault()}
                                                            >
                                                                Action
                                                            </DropdownItem>
                                                            <DropdownItem
                                                                href="#pablo"
                                                                onClick={e => e.preventDefault()}
                                                            >
                                                                Another action
                                                            </DropdownItem>
                                                            <DropdownItem
                                                                href="#pablo"
                                                                onClick={e => e.preventDefault()}
                                                            >
                                                                Something else here
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                </td>
                                            </tr>
                                        ))
                                    }

                                    </tbody>
                                </Table>
                                <CardFooter className="py-4">
                                    <nav aria-label="...">
                                        <PaginationBis page={1} totalPage={3} onPageClick={page => console.log(page)}/>
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
