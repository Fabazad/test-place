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
import constants from "../helpers/constants";
import {updateURLParameter} from "../helpers/urlHelpers";
import DropdownSelect from "../components/DropdownSelect";
import SentDemandRow from "../components/Rows/SentDemandRow";
import TestRequestModal from "../components/Modals/TestRequestModal.jsx";

class SentDemands extends React.Component {

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
            },
            selectedTest: null
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
            asTester: true
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

    onShowButtonClick(test) {
        this.setState({
            selectedTest: test
        }, () => this.toggleModal(this.modalNames.testRequest));
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
                                        <th scope="col">Vendeur</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.tests.map(test => (
                                        <SentDemandRow key={'test' + test._id} test={test}
                                                       loading={this.state.loading}
                                                       onShowButtonClick={this.onShowButtonClick}
                                        />
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
                <TestRequestModal isOpen={this.state.isModalOpen[this.modalNames.testRequest]}
                                  onToggle={() => this.toggleModal(this.modalNames.testRequest)}
                                  test={this.state.selectedTest}
                />
            </>
        );
    }
}

export default SentDemands;
