import {Col, Container, Row} from "reactstrap";
import React from "react";
import {Trans, withTranslation} from "react-i18next";

const UISection = props => {

    const {t} = props;

    return (
        <Container>
            <div className="d-flex flex-column m-auto" style={{maxWidth: "700px"}}>
                <div>
                    <div
                        className="icon icon-lg icon-shape icon-shape-danger shadow rounded-circle mb-5">
                        <i className="fa fa-user-secret"/>
                    </div>
                    <h1 className="d-inline-block ml-3">{t("WHERE_IS_THE_SCAM")}</h1>
                </div>
                <p className="text-left mb-2">En effet, il y a une arnaque, mais peut-être pas là où vous pensez.
                    🧐</p>
                <p className="text-left mb-2">Certains vendeurs Amazon qui croient en leur produit et souhaitent
                    avoir plus d'avis affin d'arriver sur la première page des recherches Amazon. ⚡</p>
                <p className="text-left mb-2">Pour cela ils sont prêts à rembourser un certains nombre de leur produit
                    contre
                    un avis posté
                    dessus. 💸</p>
                <p className="text-left mb-2">Le produit que vous achetez devient gratuit car en réalité c'est comme si
                    on
                    vous achetait
                    votre avis. ⭐</p>
                <p className="text-left mb-2">L'arnaque se fait donc sur la quantité anormale d'avis qui apparaissent
                    sur de
                    nouveaux
                    produits, cela au dépend d'autres vendeurs qui n'utilisent pas cette stratégie. 🤭
                </p>
                <p className="text-left mb-2">Afin d'être rassuré, vous pouvez voir toute les stats de chaque vendeur
                    pour
                    voir s'ils ont
                    déjà remboursé d'autres testeurs. ✅</p>
                <p className="text-left mb-2">Pour cela cliquez sur leur profil et regardez le nombre de tests terminés,
                    cela
                    indique que
                    les testeurs ont confirmé avoir reçu leur remboursement. 💪</p>
            </div>
        </Container>
    );
};

export default withTranslation()(UISection);