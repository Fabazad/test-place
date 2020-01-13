import React from "react";

// reactstrap components
import {
    Badge, UncontrolledTooltip, Media
} from "reactstrap";
import PropTypes from "prop-types";
import {textSlice, formatDate} from '../helpers/textHelpers';
import {Link} from "react-router-dom";
import Skeleton from 'react-loading-skeleton';

class ProductRaw extends React.Component {

    componentDidMount() {
    }

    render() {
        const {product} = this.props;
        if (this.props.loading) {
            return (
                <tr className={"w-100"}>
                    <th scope={'row'}>
                        <div style={{'height': '48px'}} className={"d-flex w-100 align-items-center"}>
                            <div className={"w-100"}>
                                    <Skeleton />
                            </div>
                        </div>
                    </th>
                    <th scope={'row'}>
                        <div style={{'height': '48px'}} className={"d-flex w-100 align-items-center"}>
                            <div className={"w-100"}>
                                    <Skeleton />
                            </div>
                        </div>
                    </th>
                    <th scope={'row'}>
                        <div style={{'height': '48px'}} className={"d-flex w-100 align-items-center"}>
                            <div className={"w-100"}>
                                    <Skeleton />
                            </div>
                        </div>
                    </th>
                    <th scope={'row'}>
                        <div style={{'height': '48px'}} className={"d-flex w-100 align-items-center"}>
                            <div className={"w-100"}>
                                    <Skeleton />
                            </div>
                        </div>
                    </th>
                    <th scope={'row'}>
                        <div style={{'height': '48px'}} className={"d-flex w-100 align-items-center"}>
                            <div className={"w-100"}>
                                    <Skeleton />
                            </div>
                        </div>
                    </th>
                    <th scope={'row'}>
                        <div style={{'height': '48px'}} className={"d-flex w-100 align-items-center"}>
                            <div className={"w-100"}>
                                    <Skeleton />
                            </div>
                        </div>
                    </th>
                </tr>
            )
        }
        return (
            <tr>
                <th scope="row">
                    <Media className="align-items-center">
                        <a
                            className="avatar rounded-circle mr-3"
                            href="#pablo"
                            onClick={e => e.preventDefault()}
                        >
                            <img className='shadow' alt="..."
                                 src={product.imageUrls[0].replace(/^(.+)(\.jpg)/, "$1._SS40_$2")}
                            />
                        </a>
                        <Media>
                            <span className="mb-0 text-sm">
                                {textSlice(product.title, 25)}
                            </span>
                        </Media>
                    </Media>
                </th>
                <th>
                    <h3><Badge color={'primary'}>{product.price}€</Badge></h3>
                </th>
                <th>
                    <h3><Badge
                        color={product.finalPrice > 0 ? 'warning' : 'success'}>
                        {product.finalPrice}€
                    </Badge></h3>
                </th>
                <th>
                    {
                        true ? (
                            <>
                                <Badge color={'success'}
                                       className={'badge-circle badge-lg text-center p-0'}
                                       pill>
                                    <i className="ni ni-check-bold m-auto"/>
                                </Badge>
                                <span
                                    className="ml-2 text-muted">{formatDate(product.createdAt)}</span>
                            </>
                        ) : (
                            <Badge color={'danger'}
                                   className={'badge-circle badge-lg text-center p-0'}
                                   pill>
                                <i className="ni ni-fat-remove m-auto ni-lg"/>
                            </Badge>
                        )
                    }
                </th>
                <td>0 / {product.maxDemands}</td>
                <td>
                    <div className="avatar-group">
                        <div
                            className="cursor-pointer avatar avatar-sm bg-transparent">
                            <Badge pill className="badge-circle w-100 h-100"
                                   color={'danger'}
                                   tag={Link} to={'#'} id={"remove" + product._id}>
                                <i className="fa fa-close m-auto fa-lg"/>
                            </Badge>
                            <UncontrolledTooltip
                                delay={0}
                                target={"remove" + product._id}
                            >
                                Supprimer
                            </UncontrolledTooltip>
                        </div>
                        <div
                            className="cursor-pointer avatar avatar-sm bg-transparent">
                            <Badge pill
                                   className="badge-circle w-100 h-100"
                                   color={'warning'}
                                   tag={Link} to={'#'} id={"edit" + product._id}>
                                <i className="fa fa-edit m-auto fa-lg"/>
                            </Badge>
                            <UncontrolledTooltip
                                delay={0}
                                target={"edit" + product._id}
                            >
                                Editer
                            </UncontrolledTooltip>
                        </div>
                        <div
                            className="cursor-pointer avatar avatar-sm bg-transparent">
                            <Badge pill
                                   className="badge-circle w-100 h-100"
                                   color={'info'}
                                   tag={Link} to={'/ad/' + product._id}
                                   id={"see" + product._id}>
                                <i className="fa fa-eye m-auto fa-lg"/>
                            </Badge>
                            <UncontrolledTooltip
                                delay={0}
                                target={"see" + product._id}
                            >
                                Voir
                            </UncontrolledTooltip>
                        </div>
                        <div
                            className="cursor-pointer avatar avatar-sm bg-transparent">
                            <Badge pill
                                   className="badge-circle w-100 h-100"
                                   color={'primary'}
                                   tag={Link} to={'#'} id={"upgrade" + product._id}>
                                <i className="fa fa-diamond m-auto fa-lg"/>
                            </Badge>
                            <UncontrolledTooltip
                                delay={0}
                                target={"upgrade" + product._id}
                            >
                                Upgrade
                            </UncontrolledTooltip>
                        </div>
                    </div>
                </td>
            </tr>
        );
    }
}

ProductRaw.propTypes = {
    product: PropTypes.object,
    loading: PropTypes.bool
};

export default ProductRaw;