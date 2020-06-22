import {Col, Container, Row} from "reactstrap";
import React, {useEffect, useState} from "react";
import ProductCard from "../../components/Cards/ProductCard";
import productServices from "../../services/product.service";
import ProductCardSkeleton from "../../components/Cards/ProductCardSkeleton";
import Button from "reactstrap/es/Button";
import {Link} from "react-router-dom";

const ProductDisplay = () => {

    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        productServices.find({
            searchData: {
                itemsPerPage: 8,
                page: 1,
                published: true,
                remainingRequests: true
            }
        })
            .then(res => {
                setProducts(res.hits);
                setLoading(false);
            });
    }, []);

    return (
        <Container>
            <Row>
                {!loading && products && !!products.length && products.map((product, index) =>
                    <Col xs={12} md={6} lg={4} xl={3} key={index} className="my-2">
                        <ProductCard product={product}/>
                    </Col>
                )}
                {loading && (new Array(8)).fill(null).map((_,index) => (
                    <Col xs={12} md={6} lg={4} xl={3} key={index} className="my-2">
                        <ProductCardSkeleton/>
                    </Col>
                ))}
            </Row>
            <div className="w-100 text-center mt-5">
                <Button color="primary" tag={Link} to="/search">Plus de Produits...</Button>
            </div>
        </Container>
    )
};

export default ProductDisplay;