import React, {useState, useEffect} from "react";
import testsServices from "../services/test.services";
import {Card, CardFooter, CardHeader, Table} from "reactstrap";
import Badge from "reactstrap/es/Badge";
import DropdownSelect from "./DropdownSelect";
import PaginationBis from "./PaginationBis";
import constants from "../helpers/constants";
import PropTypes from "prop-types";
import {withTranslation} from "react-i18next";
import userServices from "../services/user.services";
import CardBody from "reactstrap/es/CardBody";
import ReceivedDemandRow from "./Rows/ReceivedDemandRow";
import RowSkeleton from "./Rows/RowSkeleton";

const {ITEMS_PER_PAGE} = constants;

const TestListWithControls = props => {
    const {title, t, statusesOptions} = props;

    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [selectedTest, setSelectedTest] = useState(null);
    const [statusFilter, setStatusFilter] = useState(null);
    const [tests, setTests] = useState(null);
    const [loading, setLoading] = useState(false);

    const search = () => {
        setLoading(true);
        const searchData = {
            seller: userServices.getCurrentUserId(),
            statuses: statusFilter ? [statusFilter] : statusesOptions.map(opt => opt.value),
            itemsPerPage: ITEMS_PER_PAGE,
            page: page,
            asSeller: true
        };

        testsServices.find({searchData})
            .then(testSearch => {
                setTests(testSearch.hits);
                setTotalCount(testSearch.totalCount);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    // On component init
    useEffect(() => {
        testsServices.testsSubject.subscribe(search);
        return () => testsServices.testsSubject.unsubscribe();
    }, []);

    // On search controls update
    useEffect(search, [page, statusFilter]);

    return (
        <>
            <Card className="shadow">
                <CardHeader className="border-0">
                    <h3 className="mb-0 d-inline-block mt-2">
                        {title}
                        <Badge color="primary" pill className="ml-3 badge-circle">
                            <h4 className="m-0">{totalCount}</h4>
                        </Badge>
                    </h3>
                    <div className="float-right text-center">
                        <div className="d-inline-block w-200px my-2 ml-2 my-md-0">
                            <DropdownSelect
                                options={statusesOptions} placeholder={'Filtrer par Status'} value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)} name={'statusFilter'}/>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="p-0">
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
                        {!tests || loading ? (
                            <>
                                {(new Array(ITEMS_PER_PAGE)).fill(null).map((row, i) => (
                                    <RowSkeleton key={'skeleton'+i} colNumber={7}/>
                                ))}
                            </>) : (
                            <>
                                {tests.map(test => (
                                    <ReceivedDemandRow key={'test' + test._id} test={test} loading={loading}
                                                       onShowButtonClick={() => console.log("click")}/>
                                ))}
                            </>)}

                        </tbody>
                    </Table>
                </CardBody>
                <CardFooter className="py-4">
                    <nav aria-label="...">
                        <PaginationBis page={page}
                                       totalPage={Math.ceil(totalCount / ITEMS_PER_PAGE)}
                                       onPageClick={page => setPage(page)}/>
                    </nav>
                </CardFooter>
            </Card>
        </>
    );
};

TestListWithControls.propTypes = {
    title: PropTypes.string.isRequired,
    statusesOptions: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired
    })).isRequired
};

export default withTranslation()(TestListWithControls);