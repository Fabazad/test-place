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
import testsServices from '../services/test.services';
import userServices from '../services/user.services';
import PaginationBis from "../components/PaginationBis";
import constants from "../helpers/constants";
import {updateURLParameter} from "../helpers/urlHelpers";
import DropdownSelect from "../components/DropdownSelect";

class SentDemands extends React.Component {

    _isMount = true;

    constructor(props) {
        super(props);
        this.state = {
            tests: [],
            totalCount: 0,
            loading: false,
            page: 1,
            statusFilter: null,
            statuses: [],
            statusesFilter: {},
            statusesFilterOptions: {}
        };
    }

    componentDidMount() {
        testsServices.testsSubject.subscribe(() => this.findTests());
        testsServices.getTestStatuses().then(statuses => {
            const statusesFilterOptions = [
                statuses.requested,
                statuses.cancelled,
                statuses.requestDeclined,
                statuses.requestAccepted
            ];
            this.setState({
                statuses,
                statusesFilterOptions,
                statusesFilter: statusesFilterOptions
            });
            testsServices.testsSubject.next();
        });
    }

    componentWillUnmount() {
        this._isMount = false;
    }

    findTests() {
        if (!this._isMount) {
            return;
        }
        const searchData = {
            seller: userServices.currentUserId,
            statuses: this.state.statusesFilter
        };

        searchData.itemsPerPage = constants.ITEMS_PER_PAGE;
        searchData.page = this.state.page;
        searchData.statusFilter = this.state.statusFilter;

        this.setState({loading: true});
        testsServices.find({searchData})
            .then(testSearch => this.setState({
                    tests: testSearch.hits,
                    totalCount: testSearch.totalCount,
                    loading: false
                })
            );
    }

    onFilterChange(e) {
        const statusFilter = e.target.value;
        const statusesFilter = e.target.value ? [e.target.value] : this.state.statusesFilterOptions;
        this.setState({statusFilter, statusesFilter}, () => {
            let url = window.location.href;
            url = updateURLParameter(url, 'statusFilter', statusFilter);
            window.history.pushState({}, "", url);
            this.goToPage(1);
        });
    }

    goToPage(page) {
        let url = window.location.href;
        url = updateURLParameter(url, 'page', page);
        window.history.pushState({}, "", url);

        this.setState({page}, this.findTests);
    }

    render() {
        const statusesFilterOptions = Object.keys(this.state.statusesFilterOptions).map(statusKey => {
            return {
                text: this.state.statusesFilterOptions[statusKey],
                value: this.state.statusesFilterOptions[statusKey]
            }
        });
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
                                        Mes Demandes de Test Envoyées - {this.state.totalCount}
                                    </h3>
                                    <div className="float-right text-center">
                                        <div className="d-inline-block w-200px my-2 ml-2 my-md-0">
                                            <DropdownSelect
                                                options={statusesFilterOptions}
                                                placeholder={'Filtrer par Status'} value={this.state.statusFilter}
                                                onChange={(e) => this.onFilterChange(e)} name={'statusFilter'} />
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
                                    {this.state.tests.map(test => (
                                        <tr key={'product' + test._id}><td>yo</td></tr>
                                    ))}
                                    </tbody>
                                </Table>
                                <div className="container d-block d-lg-none">
                                    <div className="row">
                                        {this.state.tests.map(test => (
                                            <div className="col-12 col-md-6 my-2" key={"productCard" + test._id}>
                                                yo
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

export default SentDemands;
