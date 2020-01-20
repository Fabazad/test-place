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
import EditProductButton from "../Buttons/EditProductButton";
import UpgradeProductButton from "../Buttons/UpgradeProductButton";
import SkeletonProductRaw from "./SkeletonProductRaw";

class ProductRaw extends React.Component {

    render() {
        const { product } = this.props;

        const published = product.publishExpirationDate ? new Date(product.publishExpirationDate).getTime() > Date.now() : false;
        if (this.props.loading) {
            return (<SkeletonProductRaw/>)
        }
        return (
            <tr>
                <th scope="row">
                    <Media className="align-items-center">
                        <a className="avatar rounded-circle mr-3 bg-transparent" href="#pablo" onClick={e => e.preventDefault()} >
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
                    <h3>
                        <Badge color={product.finalPrice > 0 ? 'warning' : 'success'}>{product.finalPrice}€</Badge>
                    </h3>
                </th>
                <th>
                    {
                        published ? (
                            <>
                                <Badge color={'success'}
                                       className={'badge-circle badge-lg text-center p-0'}
                                       pill>
                                    <i className="ni ni-check-bold m-auto"/>
                                </Badge>
                                <span
                                    className="ml-2 text-muted">{formatDate(product.publishDate)}</span>
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
                        {published ? (
                            <div className="cursor-pointer avatar avatar-sm bg-transparent">
                                <UnpublishProductButton productId={product._id}/>
                            </div>
                        ) : (
                            <>
                                <div className="cursor-pointer avatar avatar-sm bg-transparent">
                                    <DeleteProductButton productId={product._id}/>
                                </div>
                                <div className="cursor-pointer avatar avatar-sm bg-transparent">
                                    <PublishProductButton productId={product._id}/>
                                </div>
                            </>
                        )}
                        <div className="cursor-pointer avatar avatar-sm bg-transparent">
                            <EditProductButton productId={product._id}/>
                        </div>
                        {published ? (
                            <div className="cursor-pointer avatar avatar-sm bg-transparent">
                                <SeeProductButton productId={product._id}/>
                            </div>
                        ) : null}
                        <div className="cursor-pointer avatar avatar-sm bg-transparent">
                            <UpgradeProductButton productId={product._id}/>
                        </div>
                    </div>
                </td>
            </tr>
        );
    }
}

ProductRaw.propTypes = {
    product: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
};

export default ProductRaw;