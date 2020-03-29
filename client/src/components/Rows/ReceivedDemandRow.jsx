import React from "react";

// reactstrap components
import {
    Badge, Media
} from "reactstrap";
import PropTypes from "prop-types";
import {textSlice, formatDate} from '../../helpers/textHelpers';
import SkeletonProductRow from "./SkeletonProductRow";
import {Link} from "react-router-dom";
import TestStatusIcon from "../TestStatusIcon";
import ShowTestRequestButton from "../Buttons/ShowTestRequestButton";

class ReceivedDemandRow extends React.Component {

    render() {
        const {test} = this.props;

        if (this.props.loading) {
            return (<SkeletonProductRow/>)
        }
        return (
            <tr>
                <td scope="row">
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
                <td>{test.tester.name}</td>
                <td>
                    <Badge color={'info'} className={'badge-circle badge-lg text-center p-0'} pill>
                        {formatDate(test.createdAt)}
                    </Badge>
                </td>
                <td>
                    <TestStatusIcon status={test.status}/>
                </td>
                <td>
                    <div className="avatar-group pl-3">
                        <ShowTestRequestButton onClick={() => this.props.onShowButtonClick(test._id)} testId={test._id}/>
                    </div>
                </td>
            </tr>
        );
    }
}

ReceivedDemandRow.propTypes = {
    test: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    onShowButtonClick: PropTypes.func.isRequired
};

export default ReceivedDemandRow;