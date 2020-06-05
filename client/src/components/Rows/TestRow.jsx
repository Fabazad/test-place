import React, {useState} from "react";
import PropTypes from "prop-types";
import constants from "../../helpers/constants";
import {Link} from "react-router-dom";
import {Badge, Media} from "reactstrap";
import {formatDate, textSlice} from "../../helpers/textHelpers";
import TestStatusIcon from "../TestStatusIcon";
import testServices from "../../services/test.services";
import TestListButtons from "../Buttons/TestListButtons";

const {USER_ROLES} = constants;

const TestRow = props => {

    const {test, userRole, globalStatus, onClick} = props;

    const [statuses, setStatuses] = useState({});
    testServices.getTestStatuses().then(statuses => setStatuses(statuses));

    if (!test || !userRole || !globalStatus) return null;

    const handleClick = (action) => {
        if (onClick) {
            onClick(test._id, action);
        }
    };

    return (
        <tr>
            <td>
                <Link to={'/ad/' + test.product._id}>
                    <Media className="align-items-center">
                        <div className="avatar rounded-circle mr-3 bg-transparent shadow">
                            <img className="shadow" alt="..."
                                 src={test.product.imageUrls[0].replace(/^(.+)(\.jpg)/, "$1._SS40_$2")}
                            />
                        </div>
                        <Media>
                            <span className="mb-0 text-sm">
                                {textSlice(test.product.title, 25)}
                            </span>
                        </Media>
                    </Media>
                </Link>
            </td>
            <td>
                <h3><Badge color={'primary'}>{test.product.price}€</Badge></h3>
            </td>
            <td>
                <h3>
                    <Badge
                        color={test.product.finalPrice > 0 ? 'warning' : 'success'}>{test.product.finalPrice}€</Badge>
                </h3>
            </td>
            <td>
                {userRole === USER_ROLES.TESTER ? test.seller.name : null}
                {userRole === USER_ROLES.SELLER ? test.tester.name : null}
            </td>
            <td>
                <Badge color='info' className='badge-circle badge-lg text-center p-0 bg-white' pill>
                    {formatDate(test.createdAt)}
                </Badge>
            </td>
            <td>
                <TestStatusIcon status={test.status} globalStatus={globalStatus}/>
            </td>
            <td>
                <div className="avatar-group pl-3">
                    <TestListButtons statuses={statuses} globalStatus={globalStatus} onClick={handleClick} test={test}
                                     userRole={userRole}/>
                </div>
            </td>
        </tr>
    );
};

TestRow.propTypes = {
    test: PropTypes.object.isRequired,
    userRole: PropTypes.string.isRequired,
    globalStatus: PropTypes.string.isRequired,
    onClick: PropTypes.func
};

export default TestRow;