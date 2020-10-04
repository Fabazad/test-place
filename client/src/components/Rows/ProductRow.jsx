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
import productServices from "../../services/product.service";
import {Link} from "react-router-dom";
import EditProductModal from "../Modals/EditProductModal";

const ProductRow = props => {
    const {product} = props;

    const published = productServices.isPublished(product);

    const imgSrc = product && product.imageUrls && product.imageUrls[0] ?
        product.imageUrls[0].replace(/^(.+)(\.jpg)/, "$1._SS40_$2") : false;

    return (
        <tr>
            <th scope="row">
                <Media className="align-items-center">
                    <div className="avatar rounded-circle mr-3 bg-transparent shadow">
                        {imgSrc ? <img className="shadow" alt="..." src={imgSrc} /> : null}
                    </div>
                    <Media>
                        <Link className="mb-0 text-sm" to={'/ad/' + product._id}>
                            {textSlice(product.title, 25)}
                        </Link>
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
                        <Badge color='success' className={'badge-circle badge-lg text-center p-0'} pill>
                            <i className="ni ni-check-bold m-auto"/>
                        </Badge>
                        <span
                            className="ml-2 text-muted">{formatDate(product.publishExpirationDate)}</span>
                    </>
                ) : (
                    <Badge color='danger' className={'badge-circle badge-lg text-center p-0'} pill>
                        <i className="ni ni-fat-remove m-auto ni-lg"/>
                    </Badge>
                )}
            </th>
            <td>{product.testsCount} / {product.maxDemands}</td>
            <td>
                <div className="avatar-group pl-3">
                    {published ? (
                        <>
                            <UnpublishProductButton productId={product._id}/>
                        </>
                    ) : (
                        <>
                            <DeleteProductButton productId={product._id}/>
                            <PublishProductButton productId={product._id}/>
                        </>
                    )}
                    <EditProductModal product={product}/>
                </div>
            </td>
        </tr>
    );
};

ProductRow.propTypes = {
    product: PropTypes.object.isRequired
};

export default ProductRow;