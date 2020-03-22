import React from "react";

// reactstrap components
import {
    Badge, Media
} from "reactstrap";
import PropTypes from "prop-types";
import {textSlice, formatDate} from '../../helpers/textHelpers';
import PublishProductButton from "../Buttons/PublishProductButton";
import UnpublishProductButton from "../Buttons/UnpublishProductButton";
import DeleteProductButton from "../Buttons/DeleteProductButton";
import SeeProductButton from "../Buttons/SeeProductButton";
import UpgradeProductButton from "../Buttons/UpgradeProductButton";
import SkeletonProductRow from "./SkeletonProductRow";
import EditProductModal from "../Modals/EditProductModal";

class ProductRow extends React.Component {

    render() {
        const {product} = this.props;

        const published = product.publishExpirationDate ? new Date(product.publishExpirationDate).getTime() > Date.now() : false;
        if (this.props.loading) {
            return (<SkeletonProductRow/>)
        }
        return (
            <tr>
                <th scope="row">
                    <Media className="align-items-center">
                        <div className="avatar rounded-circle mr-3 bg-transparent shadow">
                            <img className="shadow" alt="..."
                                 src={product.imageUrls[0].replace(/^(.+)(\.jpg)/, "$1._SS40_$2")}
                            />
                        </div>
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
                    <h3>
                        <Badge color={product.finalPrice > 0 ? 'warning' : 'success'}>{product.finalPrice}€</Badge>
                    </h3>
                </th>
                <th>
                    {published ? (
                        <>
                            <Badge color={'success'}
                                   className={'badge-circle badge-lg text-center p-0'} pill>
                                <i className="ni ni-check-bold m-auto"/>
                            </Badge>
                            <span
                                className="ml-2 text-muted">{formatDate(product.publishExpirationDate)}</span>
                        </>
                    ) : (
                        <Badge color={'danger'}
                               className={'badge-circle badge-lg text-center p-0'} pill>
                            <i className="ni ni-fat-remove m-auto ni-lg"/>
                        </Badge>
                    )}
                </th>
                <td>{product.maxDemands - product.remainingRequests} / {product.maxDemands}</td>
                <td>
                    <div className="avatar-group pl-3">
                        {published ? (
                            <>
                                <UnpublishProductButton productId={product._id}/>
                                <SeeProductButton productId={product._id}/>
                            </>
                        ) : (
                            <>
                                <DeleteProductButton productId={product._id}/>
                                <PublishProductButton productId={product._id}/>
                            </>
                        )}
                        <EditProductModal product={product}/>
                        <UpgradeProductButton productId={product._id}/>
                    </div>
                </td>
            </tr>
        );
    }
}

ProductRow.propTypes = {
    product: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
};

export default ProductRow;