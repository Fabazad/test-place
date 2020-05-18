import {Badge, Button, Card, CardBody, Col, Container, Row} from "reactstrap";
import React from "react";
import {Link} from "react-router-dom";

const MarketingCards = () => {
    return (
        <Container className="py-3">
            <Row className="justify-content-center">
                <Col md={6} lg={4} className="my-3">
                    <Card className="card-lift--hover shadow border-0">
                        <CardBody className="py-5">
                            <div className="icon icon-shape icon-shape-primary rounded-circle mb-4">
                                <i className="fa fa-search"/>
                            </div>
                            <h4 className="text-primary text-uppercase">
                                Moteur de recherche
                            </h4>
                            <p className="description mt-4 mb-5">
                                Ne perdez plus de temps à<br/>
                                <b>scroller indéfiniement</b> les pages Facebook.<br/><br/>

                                Trouvez en <b>une minute</b><br/>
                                le produit qui vous <b>intéresse</b>.
                            </p>
                            <div>
                                <Badge color="primary" pill className="mr-1">Rapide</Badge>
                                <Badge color="primary" pill className="mr-1">Efficace</Badge>
                                <Badge color="primary" pill className="mr-1">Complet</Badge>
                            </div>
                            <Button tag={Link} to="/search" className="mt-4" color="primary">
                                Rechercher
                            </Button>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={6} lg={4} className="my-3">
                    <Card className="card-lift--hover shadow border-0">
                        <CardBody className="py-5">
                            <div className="icon icon-shape icon-shape-success rounded-circle mb-4">
                                <i className="fa fa-shield-alt"/>
                            </div>
                            <h4 className="text-success text-uppercase">
                                Démarches encadrées
                            </h4>
                            <p className="description mt-4 mb-5">
                                N'ayez plus <b>peur de vous faire arnaquer</b><br/>
                                ou de vous <b>perdre dans les démarches</b>.<br/><br/>
                                Vous testez les articles <b>sereinement</b><br/>
                                comme pour n'importe quel <b>simple achat</b>.
                            </p>
                            <div>
                                <Badge color="success" pill className="mr-1">Simple</Badge>
                                <Badge color="success" pill className="mr-1">Tranquille</Badge>
                                <Badge color="success" pill className="mr-1">Sécurisé</Badge>
                            </div>
                            <Button tag={Link} to="/register" className="mt-4" color="success">
                                Créer un compte
                            </Button>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={6} lg={4} className="my-3">
                    <Card className="card-lift--hover shadow border-0">
                        <CardBody className="py-5">
                            <div
                                className="icon icon-shape icon-shape-warning rounded-circle mb-4">
                                <i className="fa fa-euro-sign"/>
                            </div>
                            <h4 className="text-warning text-uppercase">
                                Articles remboursés
                            </h4>
                            <p className="description mt-4 mb-5">
                                Ne vous privez plus à cause de<br/>
                                votre <b>faible budget</b>.<br/><br/>
                                Profitez de produit, pour la majorité,<br/>
                                <b>entièrement gratuits</b>.
                            </p>
                            <div>
                                <Badge color="warning" pill className="mr-1">Ecouteurs</Badge>
                                <Badge color="warning" pill className="mr-1">Enceintes</Badge>
                                <Badge color="warning" pill className="mr-1">Caméras</Badge>
                                <Badge color="warning" pill className="mr-1">...</Badge>
                            </div>
                            <Button className="mt-4" color="warning" onClick={e => e.preventDefault()}>
                                Partager
                            </Button>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
};

export default MarketingCards;