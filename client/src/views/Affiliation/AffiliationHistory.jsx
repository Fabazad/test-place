import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import {
  Badge,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Row,
  Table,
} from "reactstrap";
import DropdownSelect from "../../components/DropdownSelect";
import Loading from "../../components/Loading";
import PaginationBis from "../../components/PaginationBis";
import constants from "../../helpers/constants";
import { formatDate } from "../../helpers/textHelpers";
import { AffiliationServices } from "../../services/affiliation.service";

const { ITEMS_PER_PAGE_OPTIONS } = constants;

export const AffiliationHistory = withTranslation()(({ t }) => {
  const [records, setRecords] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[1].value);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await AffiliationServices.getLastAffiliationRecords({
        page,
        itemsPerPage,
      });
      setRecords(res.records);
      setTotalCount(res.totalCount);
      setLoading(false);
    })();
  }, [page, itemsPerPage]);

  const getBadgeColorFromRecord = (record) => {
    if (record.params.paramsType === "appPayment") return "primary";

    if (record.params.status === "moneyReceived") {
      return "success";
    }
    return "default";
  };

  const getTypeFromRecord = (record) => {
    if (record.params.paramsType === "appPayment") return t("APP_PAYMENT");
    if (record.params.status === "moneyReceived") return t("MONEY_RECEIVED");
    if (record.params.status === "productOrdered") return t("PRODUCT_ORDERED");
    if (record.params.status === "testRequest") return t("TEST_REQUESTED");
    return "Unknown";
  };

  return (
    <Card className="shadow">
      <CardHeader className="bg-white border-0">
        <Row className="align-items-center">
          <Col xs="8">
            <h3 className="mb-0">
              {t("AFFILIATION_HISTORY")}
              <Badge color="primary" pill className="ml-3 badge-circle">
                <h4 className="m-0">{totalCount}</h4>
              </Badge>
            </h3>
          </Col>
        </Row>
      </CardHeader>
      <CardBody className="p-0">
        <Table className="align-items-center table-flush position-relative" responsive>
          <Loading loading={loading} />
          <thead className="thead-light">
            <tr>
              <th scope="col">{t("NAME")}</th>
              <th scope="col">{t("RATE")}</th>
              <th scope="col">{t("DATE")}</th>
              <th scope="col">{t("TYPE")}</th>
              <th scope="col">{t("AMOUNT")}</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id}>
                <td>{record.params.affiliated.name}</td>
                <td>{record.params.rateInPercent}%</td>
                <td>{formatDate(record.createdAt)}</td>
                <td>{getTypeFromRecord(record)}</td>
                <td>
                  <Badge
                    color={getBadgeColorFromRecord(record)}
                    pill
                    className="badge-lg font-size-lg"
                  >
                    {record.amount < 0 ? "-" : "+"}
                    {record.amount}€
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
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
        <nav aria-label="...">
          <PaginationBis
            page={page}
            totalPage={Math.ceil(totalCount / itemsPerPage)}
            onPageClick={(newPage) => setPage(newPage)}
          />
        </nav>
      </CardFooter>
    </Card>
  );
});
