import React from "react";

// reactstrap components
import {
    Card,
    CardHeader,
    CardFooter,
    Table,
    Container,
    Row
} from "reactstrap";
// core components
import Header from "../components/Headers/Header.jsx";
import testsServices from '../services/test.services';
import userServices from '../services/user.services';
import PaginationBis from "../components/PaginationBis";
import {updateURLParameter} from "../helpers/urlHelpers";
import DropdownSelect from "../components/DropdownSelect";
import ReceivedDemandRow from "../components/Rows/ReceivedDemandRow";
import TestRequestModal from "../components/Modals/TestRequestModal";
import constants from "../helpers/constants";
import TestRequestCard from "../components/Cards/TestRequestCard";
import Badge from "reactstrap/es/Badge";

const {USER_TYPES} = constants;

class ReceivedDemands extends React.Component {

    _isMount = true;
    modalNames = {
        testRequest: 'testRequest'
    };

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
            statusesFilterOptions: {},
            isModalOpen: {
                testRequest: false
            }
        };
        this.onShowButtonClick = this.onShowButtonClick.bind(this);
    }

    componentDidMount() {
        testsServices.testsSubject.subscribe(() => this.findTests());
        testsServices.getTestStatuses().then(statuses => {
            const statusesFilterOptions = [
                statuses['requested'],
                statuses['requestCancelled'],
                statuses['requestDeclined'],
                statuses['requestAccepted']
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
            seller: userServices.getCurrentUserId(),
            statuses: this.state.statusesFilter,
            itemsPerPage: constants.ITEMS_PER_PAGE,
            page: this.state.page,
            statusFilter: this.state.statusFilter,
            asSeller: true
        };

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

    toggleModal(modalName) {
        const isOpen = !this.state.isModalOpen[modalName];
        this.setState({
            isModalOpen: {
                [modalName]: isOpen
            }
        });
    }

    onShowButtonClick(testId) {
        const test = this.state.tests.find(t => t._id === testId);
        if (test) {
            this.setState({
                selectedTest: Object.assign({}, test)
            }, () => this.toggleModal(this.modalNames.testRequest));
        }
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
                                        Mes Demandes de Test Reçues
                                        <Badge color="primary" pill className="ml-3 badge-circle">
                                            <h4 className="m-0">{this.state.totalCount}</h4>
                                        </Badge>
                                    </h3>
                                    <div className="float-right text-center">
                                        <div className="d-inline-block w-200px my-2 ml-2 my-md-0">
                                            <DropdownSelect
                                                options={statusesFilterOptions}
                                                placeholder={'Filtrer par Status'} value={this.state.statusFilter}
                                                onChange={(e) => this.onFilterChange(e)} name={'statusFilter'}/>
                                        </div>
                                    </div>
                                </CardHeader>
                                <Table className="align-items-center table-flush d-none d-lg-table" responsive>
                                    <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Produit</th>
                                        <th scope='col'>Prix</th>
                                        <th scope='col'>Final</th>
                                        <th scope="col">Testeur</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.tests.map(test => (
                                        <ReceivedDemandRow key={'test' + test._id} test={test}
                                                           loading={this.state.loading}
                                                           onShowButtonClick={this.onShowButtonClick}/>
                                    ))}
                                    </tbody>
                                </Table>
                                <div className="container d-block d-lg-none">
                                    <div className="row">
                                        {this.state.tests.map(test => (
                                            <div className="col-12 col-md-6 my-2" key={"testCard" + test._id}>
                                                <TestRequestCard test={test} userType={USER_TYPES.SELLER}
                                                                 onShowButtonClick={this.onShowButtonClick}/>
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
                <TestRequestModal isOpen={this.state.isModalOpen[this.modalNames.testRequest]}
                                  onToggle={() => this.toggleModal(this.modalNames.testRequest)}
                                  test={this.state.selectedTest} userType={USER_TYPES.SELLER}
                />
            </>
        );
    }
}

export default ReceivedDemands;
