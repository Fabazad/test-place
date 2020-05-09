import React from "react";

// reactstrap components
import { CardBody, Card, Row } from "reactstrap";
import Skeleton from "react-loading-skeleton";

const ProductCardSkeleton = () => {

    return (
        <Card className={"card-lift--hover shadow border-0 cursor-pointer"}>
            <CardBody>
                <div style={{'height': '200px'}} className="text-center">
                    <Skeleton height={200} width={180}/>
                </div>
                <div style={{height: '58px'}}>
                    <h5 className="text-primary mt-4">
                        <Skeleton count={2}/>
                    </h5>
                </div>
                <Row className='mt-3'>
                    <div className="col-6 text-center">
                        <div><Skeleton height={15} width={90}/></div>
                        <Skeleton height={23} width={100}/>
                    </div>
                    <div className="col-6 text-center">
                        <Skeleton height={15} width={90}/>
                        <Skeleton height={23} width={100}/>
                    </div>
                </Row>
                <div className="text-center mt-3" style={{'height': '30px'}}>
                    <Skeleton height={23} width={80}/>
                    <span className="ml-2"><Skeleton height={23} width={80}/></span>
                </div>
                <div className="mt-3">
                    <Skeleton width={100}/>
                </div>
            </CardBody>
        </Card>
    );
};

export default ProductCardSkeleton;