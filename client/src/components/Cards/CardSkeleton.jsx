import {Card, CardBody, Row} from "reactstrap";
import React from "react";
import Skeleton from "react-loading-skeleton";
import Col from "reactstrap/es/Col";

const CardSkeleton = () => {

    return (
        <Card className={"card-lift--hover shadow border-0"}>
            <CardBody>
                <Row>
                    <Col xs={12} className="text-center">
                        <Skeleton height={200} width={200}/>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col xs={12} className="text-center">
                        <Skeleton className="w-75"/>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col xs={6} className="text-center">
                        <Skeleton className="w-75"/>
                    </Col>
                    <Col xs={6} className="text-center">
                        <Skeleton className="w-75"/>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col xs={6} className="text-center">
                        <Skeleton className="w-75"/>
                    </Col>
                    <Col xs={6} className="text-center">
                        <Skeleton className="w-75"/>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col xs={12} className="text-center">
                        <Skeleton className="w-75" height={40}/>
                    </Col>
                </Row>

            </CardBody>
        </Card>
    );
};

export default CardSkeleton;