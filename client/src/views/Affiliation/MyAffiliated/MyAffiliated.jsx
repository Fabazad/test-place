import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import {
  Badge,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  Input,
  Row,
  Table,
} from "reactstrap";
import DropdownSelect from "../../../components/DropdownSelect";
import Loading from "../../../components/Loading";
import PaginationBis from "../../../components/PaginationBis";
import constants from "../../../helpers/constants";
import { AffiliationServices } from "../../../services/affiliation.service";
import { MyAffiliatedRow } from "./MyAffiliatedRow";

const { ITEMS_PER_PAGE_OPTIONS } = constants;

export const MyAffiliated = withTranslation()(({ t }) => {
  const [affiliated, setAffiliated] = useState([]);
  const [totalAffiliatedCount, setTotalAffiliatedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[1].value);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState(undefined);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await AffiliationServices.getAffiliated({
        page,
        itemsPerPage,
        search: search !== "" ? search : undefined,
      });

      setLoading(false);
      setAffiliated(res.affiliated);
      setTotalAffiliatedCount(res.totalCount);
    })();
  }, [page, itemsPerPage, search]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  return (
    <Card className="shadow">
      <CardHeader className="bg-white border-0">
        <Row className="align-items-center">
          <Col xs="8">
            <h3 className="mb-0">
              {t("MY_AFFILIATED")}
              <Badge color="primary" pill className="ml-3 badge-circle">
                <h4 className="m-0">{totalAffiliatedCount}</h4>
              </Badge>
            </h3>
          </Col>
          <Col xs="4" className="text-right">
            <Form onSubmit={onSearchSubmit}>
              <Input
                type="text"
                placeholder={t("SEARCH")}
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
              />
            </Form>
          </Col>
        </Row>
      </CardHeader>
      <CardBody className="p-0">
        <Table className="align-items-center table-flush position-relative" responsive>
          <Loading loading={loading} />
          <thead className="thead-light">
            <tr>
              <th scope="col">{t("NAME")}</th>
              <th scope="col">{t("ACTIVATION_EVENTS")}</th>
              <th scope="col">{t("EMAIL")}</th>
              <th scope="col">{t("RATE")}</th>
            </tr>
          </thead>
          <tbody>
            {affiliated.map((a) => (
              <MyAffiliatedRow affiliated={a} />
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
            totalPage={Math.ceil(totalAffiliatedCount / itemsPerPage)}
            onPageClick={(newPage) => setPage(newPage)}
          />
        </nav>
      </CardFooter>
    </Card>
  );
});
