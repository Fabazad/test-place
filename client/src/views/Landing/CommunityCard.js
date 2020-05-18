import {Button, Card, Col, Row} from "reactstrap";
import React from "react";

const CommunityCard = () => {
    return (
        <Card className="bg-gradient-warning shadow-lg border-0">
            <div className="p-5">
                <Row className="align-items-center">
                    <Col lg="8">
                        <h2 className="text-white">Rejoignez la communauté</h2>
                        <p className="lead text-white mt-4 mb-3">
                            Que vous soyez Testeur, Vendeur ou bien Intermédaire,<br/>
                            suivez des milliers d'autres personnes comme vous,<br/>
                            qui font cela depuis des années.
                        </p>
                    </Col>
                    <Col className="ml-lg-auto" lg="3">
                        <Button block className="btn-white" color="default" size="lg">
                            Rejoindre
                        </Button>
                    </Col>
                </Row>
            </div>
        </Card>
    );
};

export default CommunityCard;