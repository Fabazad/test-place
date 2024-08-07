import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Badge, Media } from "reactstrap";
import constants from "../../helpers/constants";
import { formatDate, textSlice } from "../../helpers/textHelpers";
import TestListButtons from "../Buttons/TestListButtons";
import TestStatusIcon from "../TestStatusIcon";

const { USER_ROLES } = constants;
const TestRow = (props) => {
  const { test, userRole, globalStatus, onClick } = props;

  if (!test || !userRole || !globalStatus) return null;

  const handleClick = (action) => {
    if (onClick) {
      onClick(test._id, action);
    }
  };

  return (
    <tr>
      <td>
        <Link to={"/ad/" + test.product._id}>
          <Media className="align-items-center">
            <div className="avatar rounded-circle mr-3 bg-transparent shadow">
              <img
                className="shadow"
                alt="..."
                src={test.product.imageUrls[0].replace(/^(.+)(\.jpg)/, "$1._SS40_$2")}
              />
            </div>
            <Media>
              <span className="mb-0 text-sm">{textSlice(test.product.title, 25)}</span>
            </Media>
          </Media>
        </Link>
      </td>
      <td>
        <h3>
          <Badge color={"primary"}>{test.product.price}€</Badge>
        </h3>
      </td>
      <td>
        <h3>
          <Badge color={test.product.finalPrice > 0 ? "warning" : "success"}>
            {test.product.finalPrice}€
          </Badge>
        </h3>
      </td>
      <td>
        {userRole === USER_ROLES.TESTER && <b>{test.seller.name}</b>}
        {userRole === USER_ROLES.SELLER && <b>{test.tester.name}</b>}
      </td>
      <td>
        <Badge
          color="info"
          className="badge-circle badge-lg text-center p-0 bg-white"
          pill
        >
          {formatDate(test.createdAt)}
        </Badge>
      </td>
      <td>
        <TestStatusIcon status={test.status} globalStatus={globalStatus} />
      </td>
      <td>
        <div className="d-flex" style={{ gap: "0.2em" }}>
          <TestListButtons
            globalStatus={globalStatus}
            onClick={handleClick}
            test={test}
            userRole={userRole}
          />
        </div>
      </td>
    </tr>
  );
};

TestRow.propTypes = {
  test: PropTypes.object.isRequired,
  userRole: PropTypes.string.isRequired,
  globalStatus: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default TestRow;
