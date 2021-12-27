import {Container} from "reactstrap";
import React from "react";
import {withTranslation} from "react-i18next";
import CertifiedIcon from "../../components/CertifiedIcon";

const FreeProducts = props => {

    const {t} = props;

    return (
        <Container>
            <div className="d-flex flex-column m-auto" style={{maxWidth: "1000px"}}>
                <div>
                    <div
                        className="icon icon-lg icon-shape icon-shape-success shadow rounded-circle mb-5">
                        <i className="fa fa-euro-sign"/>
                    </div>
                    <h1 className="d-inline-block ml-3">{t("FREE_PRODUCT_QUESTION")}</h1>
                </div>

                <div className="d-flex align-items-center">
                    <div className="mr-4">
                        <div className="icon icon-shape icon-shape-info">
                            <i className="fab fa-amazon"/>
                        </div>
                    </div>
                    <p className="text-left mb-3">
                        Certains vendeurs sur Amazon souhaitent avoir <b>plus d'avis</b> afin d'arriver sur <b>la
                        première page des recherches Amazon</b> et donc vendre bien plus.
                    </p>
                </div>

                <div className="d-flex align-items-center mt-5">
                    <div className="mr-3">
                        <div className="icon icon-shape icon-shape-info">
                            <i className="fa fa-rocket"/>
                        </div>
                    </div>
                    <p className="text-left mb-3">
                        Pour cela ils ont besoin d'<b>augmenter la quantité de leur avis</b> et ils sont
                        prêts à les échanger contre des <b>produits gratuits</b> pour atteindre cet objectif.
                    </p>
                </div>

                <div className="d-flex align-items-center mt-5">
                    <div className="mr-4">
                        <div className="icon icon-shape icon-shape-info">
                            <i className="fa fa-star"/>
                        </div>
                    </div>
                    <p className="text-left mb-3">
                        Sur Test Place les produits sont donc <b>gratuits car vous les échangez contre des avis
                        Amazon</b>.
                    </p>
                </div>

                <div className="d-flex align-items-center mt-5">
                    <div className="mr-4">
                        <div className="icon icon-shape icon-shape-info">
                            <i className="fa fa-shield-alt"/>
                        </div>
                    </div>
                    <p className="text-left mb-3">
                        Cette pratique peut faire <b>peur</b> au début.<br/>
                        <b>Pour être rassuré</b>, ne choisissez que des vendeurs <b>certifiés honnêtes</b>.
                        <CertifiedIcon className="ml-2"/>
                    </p>
                </div>

                <div className="d-flex align-items-center mt-5">
                    <div className="mr-4">
                        <div className="icon icon-shape icon-shape-info">
                            <i className="fa fa-medal"/>
                        </div>
                    </div>
                    <p className="text-left mb-3">
                        Cela indique que la <b>grande majorité</b> des testeurs ont validé avoir <b>reçu le
                        remboursement</b> de ce vendeur.
                    </p>
                </div>
            </div>
        </Container>
    );
};

export default withTranslation()(FreeProducts);