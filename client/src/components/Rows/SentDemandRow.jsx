import React from "react";

// reactstrap components
import {
    Badge, Media, UncontrolledTooltip
} from "reactstrap";
import PropTypes from "prop-types";
import {textSlice, formatDate} from '../../helpers/textHelpers';
import SkeletonProductRow from "./SkeletonProductRow";
import {Link} from "react-router-dom";
import CancelTestRequestButton from "../Buttons/CancelTestRequestButton";
import testServices from "../../services/test.services";
import ShowTestRequestButton from "../Buttons/ShowTestRequestButton";
import {withTranslation} from "react-i18next";

class SentDemandRow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            statuses: []
        }
    }

    componentDidMount() {
        testServices.getTestStatuses().then(statuses => this.setState({statuses}));
    }

    getStatusColor(status) {
        const {statuses} = this.state;
        if (!Object.keys(statuses).length) return '';
        if (statuses['requested'] === status) return 'warning';
        if (statuses['requestCancelled'] === status) return 'default';
        if (statuses['requestDeclined'] === status) return 'danger';
        return 'success';
    }

    getIconClass(status) {
        const {statuses} = this.state;
        if (!Object.keys(statuses).length) return '';
        if (statuses['requested'] === status) return 'fa-hourglass';
        if (statuses['requestCancelled'] === status) return 'fa-times';
        if (statuses['requestDeclined'] === status) return 'fa-hand-paper';
        return 'fa-check';
    }

    render() {
        const {test, t} = this.props;
        const {statuses} = this.state;

        if (this.props.loading || !test) {
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
                <td>{test.seller.name}</td>
                <td>
                    <Badge color={'info'} className={'badge-circle badge-lg text-center p-0'} pill>
                        {formatDate(test.createdAt)}
                    </Badge>
                </td>
                <td>
                    <span>
                        <Badge pill className="badge-circle" color={this.getStatusColor(test.status)} id={'status-' + test._id}>
                            <i className={"fa m-auto " + this.getIconClass(test.status)}/>
                        </Badge>
                        <UncontrolledTooltip delay={0} target={"status-" + test._id}>{t(test.status)}</UncontrolledTooltip>
                    </span>
                </td>
                <td>
                    <div className="avatar-group">
                        {test.status === statuses.requested ? (
                            <CancelTestRequestButton testId={test._id}/>) : null}
                        <ShowTestRequestButton onClick={() => this.props.onShowButtonClick(test)} testId={test._id}/>

                    </div>
                </td>
            </tr>
        );
    }
}

SentDemandRow.propTypes = {
    test: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    onShowButtonClick: PropTypes.func.isRequired
};

export default withTranslation()(SentDemandRow);