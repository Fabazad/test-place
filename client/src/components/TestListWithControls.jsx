import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Card, CardFooter, CardHeader, Table } from "reactstrap";
import Badge from "reactstrap/es/Badge";
import CardBody from "reactstrap/es/CardBody";
import Col from "reactstrap/es/Col";
import Container from "reactstrap/es/Container";
import Row from "reactstrap/es/Row";
import constants, { TestStatus } from "../helpers/constants";
import { scrollTop } from "../helpers/scrollHelpers";
import { removeUrlParameters, updateURLParameters } from "../helpers/urlHelpers";
import testsServices from "../services/test.services";
import userServices from "../services/user.services";
import CardSkeleton from "./Cards/CardSkeleton";
import TestCard from "./Cards/TestCard";
import DropdownSelect from "./DropdownSelect";
import CancelTestModal from "./Modals/CancelTestModal";
import DeclineReviewModal from "./Modals/DeclineReviewModal";
import OrderedProductModal from "./Modals/OrderedProductModal";
import ProductReviewedModal from "./Modals/ProductReviewedModal";
import TestModal from "./Modals/TestModal/TestModal";
import PaginationBis from "./PaginationBis";
import RowSkeleton from "./Rows/RowSkeleton";
import TestRow from "./Rows/TestRow";

const { USER_ROLES, ITEMS_PER_PAGE, TEST_ROW_CLICK_ACTIONS, ITEMS_PER_PAGE_OPTIONS } =
  constants;

const TestListWithControls = ({
  title,
  t,
  statusesOptions,
  userRole,
  globalStatus,
  adminView,
}) => {
  const history = useHistory();

  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [tests, setTests] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState({});
  const [statusesOptionsFormatted, setStatusesOptionsFormatted] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const [triggerSearch, setTriggerSearch] = useState(false);

  const search = async () => {
    setLoading(true);
    const searchData = {
      seller: userServices.getCurrentUserId(),
      statuses: statusFilter
        ? [statusFilter]
        : statusesOptionsFormatted.map((opt) => opt.value),
      itemsPerPage: itemsPerPage,
      page: page,
      asSeller: userRole === USER_ROLES.SELLER,
      asTester: userRole === USER_ROLES.TESTER,
    };

    scrollTop();

    try {
      const testSearch = await testsServices.find({ searchData });
      setTests(testSearch.hits);
      setTotalCount(testSearch.totalCount);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // On component init
  useEffect(() => {
    (async () => {
      try {
        const optionsFormatted = statusesOptions.map((status) => ({
          value: TestStatus[status],
          text: t(TestStatus[status]),
        }));

        setStatusesOptionsFormatted(optionsFormatted);
        const subscriber = testsServices.testsSubject.subscribe(() =>
          setTriggerSearch(true)
        );

        return () => subscriber.unsubscribe();
      } catch (e) {
        console.error(e);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // On search controls update
  useEffect(() => {
    if (statusesOptionsFormatted.length) search();
  }, [page, statusFilter, itemsPerPage, statusesOptionsFormatted]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (triggerSearch) {
      search();
      setTriggerSearch(false);
    }
  }, [triggerSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  // On testId in url
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("testId")) {
      setSelectedTestId(urlParams.get("testId"));
      toggleModal(TEST_ROW_CLICK_ACTIONS.SHOW_TEST, true);
    } else {
      toggleModal(TEST_ROW_CLICK_ACTIONS.SHOW_TEST, false);
    }
  }, [history.location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  const onActionClick = (testId, action) => {
    if (action === TEST_ROW_CLICK_ACTIONS.SHOW_TEST) {
      updateURLParameters({ testId });
      return;
    }

    setSelectedTestId(testId);
    toggleModal(action);
  };

  const toggleModal = (action, isOpen = !isModalOpen[action]) => {
    const newIsModalOpen = Object.assign({}, isModalOpen);
    newIsModalOpen[action] = isOpen;
    setIsModalOpen(newIsModalOpen);
  };

  return (
    <>
      <Card className="shadow">
        <CardHeader className="border-0">
          <h3 className="mb-0 d-inline-block mt-2 w-sm-100 w-md-auto text-center text-md-left">
            {title}
            <Badge color="primary" pill className="ml-3 badge-circle">
              <h4 className="m-0">{totalCount}</h4>
            </Badge>
          </h3>
          {statusesOptionsFormatted.length > 1 ? (
            <div className="float-right text-center w-sm-100 w-md-auto text-center mt-3 mt-md-0">
              <div className="d-inline-block w-200px my-2 ml-2 my-md-0">
                <DropdownSelect
                  options={statusesOptionsFormatted}
                  placeholder={t("FILTER_BY_STATUS")}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  name="statusFilter"
                />
              </div>
            </div>
          ) : null}
        </CardHeader>
        <CardBody className="p-0">
          <Table className="align-items-center table-flush d-none d-lg-table" responsive>
            <thead className="thead-light">
              <tr>
                <th scope="col">{t("PRODUCT")}</th>
                <th scope="col">{t("PRICE")}</th>
                <th scope="col">{t("FINAL")}</th>
                <th scope="col">
                  {userRole === USER_ROLES.TESTER ? t("SELLER") : null}
                  {userRole === USER_ROLES.SELLER ? t("TESTER") : null}
                </th>
                <th scope="col">Date</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                new Array(itemsPerPage)
                  .fill(null)
                  .map((row, i) => <RowSkeleton key={"skeleton" + i} colNumber={7} />)}

              {!loading &&
                tests &&
                !!tests.length &&
                tests.map((test, i) => (
                  <TestRow
                    test={test}
                    userRole={userRole}
                    globalStatus={globalStatus}
                    key={"test-row-" + i}
                    onClick={onActionClick}
                  />
                ))}
            </tbody>
          </Table>

          {tests && !tests.length && !loading ? (
            <div className="p-5 w-100 text-center">
              <img
                src={require("assets/img/undraws/empty.svg")}
                alt=""
                style={{ maxWidth: "300px" }}
                className="w-100"
              />
            </div>
          ) : null}

          <Container className="d-lg-none">
            <Row>
              {!tests || loading ? (
                <>
                  {new Array(itemsPerPage).fill(null).map((row, index) => (
                    <Col xs={12} md={6} className="my-2" key={index}>
                      <CardSkeleton />
                    </Col>
                  ))}
                </>
              ) : (
                <>
                  {tests.map((test, index) => (
                    <Col xs={12} md={6} className="my-2" key={index}>
                      <TestCard
                        test={test}
                        userRole={userRole}
                        globalStatus={globalStatus}
                        onActionClick={onActionClick}
                      />
                    </Col>
                  ))}
                </>
              )}
            </Row>
          </Container>
        </CardBody>

        <CardFooter className="py-4">
          <div className="d-none d-md-block float-left">
            <DropdownSelect
              onChange={(e) => setItemsPerPage(e.target.value)}
              name="itemsPerPage"
              options={ITEMS_PER_PAGE_OPTIONS}
              value={itemsPerPage}
            />
          </div>
          <PaginationBis
            page={page}
            totalPage={Math.ceil(totalCount / itemsPerPage)}
            onPageClick={(page) => setPage(page)}
          />
          <div className="d-md-none w-fit-content m-auto">
            <DropdownSelect
              onChange={(e) => setItemsPerPage(e.target.value)}
              name="itemsPerPage"
              options={ITEMS_PER_PAGE_OPTIONS}
              value={itemsPerPage}
            />
          </div>
        </CardFooter>
      </Card>

      {selectedTestId ? (
        <>
          <OrderedProductModal
            isOpen={!!isModalOpen[TEST_ROW_CLICK_ACTIONS.PRODUCT_ORDERED]}
            testId={selectedTestId}
            onToggle={() => toggleModal(TEST_ROW_CLICK_ACTIONS.PRODUCT_ORDERED)}
          />
          <TestModal
            userType={userRole}
            globalStatus={globalStatus}
            adminView={!!adminView}
            isOpen={!!isModalOpen[TEST_ROW_CLICK_ACTIONS.SHOW_TEST]}
            testId={selectedTestId}
            onToggle={() => removeUrlParameters("testId")}
          />
          <DeclineReviewModal
            isOpen={!!isModalOpen[TEST_ROW_CLICK_ACTIONS.REVIEW_DECLINED]}
            testId={selectedTestId}
            onToggle={() => toggleModal(TEST_ROW_CLICK_ACTIONS.REVIEW_DECLINED)}
          />
          <ProductReviewedModal
            onToggle={() => toggleModal(TEST_ROW_CLICK_ACTIONS.PRODUCT_REVIEWED)}
            testId={selectedTestId}
            isOpen={!!isModalOpen[TEST_ROW_CLICK_ACTIONS.PRODUCT_REVIEWED]}
          />
          <CancelTestModal
            onToggle={() => toggleModal(TEST_ROW_CLICK_ACTIONS.CANCEL_TEST)}
            testId={selectedTestId}
            isOpen={!!isModalOpen[TEST_ROW_CLICK_ACTIONS.CANCEL_TEST]}
          />
        </>
      ) : null}
    </>
  );
};

TestListWithControls.propTypes = {
  title: PropTypes.string.isRequired,
  statusesOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  userRole: PropTypes.string.isRequired,
  globalStatus: PropTypes.string.isRequired,
  adminView: PropTypes.bool.isRequired,
};

export default withTranslation()(TestListWithControls);
