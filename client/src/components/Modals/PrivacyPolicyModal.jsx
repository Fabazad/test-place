import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
// reactstrap components
import {
    Button,
    Modal
} from "reactstrap";
import {withTranslation} from "react-i18next";

const PrivacyPolicyModal = ({t}) => {
    const [isOpen, setIsOpen] = useState(false);

    const history = useHistory();

    const toggleModal = (e) => {
        e.preventDefault();
        history.push(isOpen ? "#" : "#privacyPolicy");
    }
    useEffect(() => setIsOpen(history.location.hash === "#privacyPolicy"),
        [history.location.hash]);

    return (
        <>
            {/* Button trigger modal */}
            <a onClick={toggleModal} className="cursor-pointer font-weight-bold text-primary">
                {t("PRIVACY_POLICY")}
            </a>
            {/* Modal */}
            <Modal
                size={"lg"}
                className="modal-dialog-centered"
                isOpen={isOpen}
                toggle={toggleModal}
            >
                <div className="modal-header">
                    <h2 className="modal-title">
                        {t("PRIVACY_POLICY")}
                    </h2>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={toggleModal}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <div className="modal-body white-space-pre-line">
                    <h3 className="mb-4">En vigueur au 10/12/2019</h3>
                    <div className="text-muted font-weight-light text-left mb-5">Les présentes conditions générales
                        d'utilisation (dites « CGU ») ont pour objet l'encadrement juridique des modalités de mise à
                        disposition du site et des services par et de définir les conditions d’accès et
                        d’utilisation des services par « l'Utilisateur ». <br/>
                        Les présentes CGU sont accessibles sur le site à la rubrique «CGU».<br/>
                        Toute inscription ou utilisation du site implique l'acceptation sans aucune réserve ni
                        restriction des présentes CGU par
                        l’utilisateur.<br/> Lors de l'inscription sur le site via le Formulaire d’inscription,
                        chaque utilisateur accepte expressément les présentes
                        CGU en cochant la case précédant le texte suivant : « Je reconnais avoir lu et compris les
                        CGU et je les accepte ».<br/>
                        En cas de non-acceptation des CGU stipulées dans le présent contrat, l'Utilisateur se doit
                        de renoncer à l'accès des services
                        proposés par le site.<br/>
                        https://test-place.com se réserve le droit de modifier unilatéralement et à tout moment le
                        contenu des présentes CGU.
                    </div>

                    <h2>
                        ARTICLE 1 : LES MENTIONS LÉGALES
                    </h2>

                    <div className="text-muted font-weight-light text-left mb-5">
                        L'édition du site https://test-place.com est assurée par la Société Société Test Place au
                        capital de 1000 euros, <br/>immatriculée au
                        RCS de Montpellier sous le numéro 000 000 000, dont le siège social est situé au Avenue
                        d’assas <br/>
                        Numéro de téléphone 0664160119 <br/>
                        Adresse e-mail : Test-place@gmail.com. <br/>
                        Le Directeur de la publication est : Pratlong Florine <br/>
                        L'hébergeur du site https://test-place.com est la société Heroku, dont le siège social est
                        situé au Heroku companie, avec le
                        numéro de téléphone : 0600000000.
                    </div>

                    <h2>
                        ARTICLE 2 : ACCÈS AU SITE
                    </h2>

                    <div className="text-muted font-weight-light text-left mb-5">
                        Le site https://test-place.com permet à l'Utilisateur un accès gratuit aux services suivants
                        : <br/>
                        Le site internet propose les services suivants :<br/>
                        Proposer des tests de produits
                        Le site est accessible gratuitement en tout lieu à tout Utilisateur ayant un accès à
                        Internet. Tous les frais supportés par
                        l'Utilisateur pour accéder au service (matériel informatique, logiciels, connexion Internet,
                        etc.) sont à sa charge.<br/>
                        L’Utilisateur non membre n'a pas accès aux services réservés. Pour cela, il doit s’inscrire
                        en remplissant le formulaire. <br/>En
                        acceptant de s’inscrire aux services réservés, l’Utilisateur membre s’engage à fournir des
                        informations sincères et exactes
                        concernant son état civil et ses coordonnées, notamment son adresse email.<br/>
                        Pour accéder aux services, l’Utilisateur doit ensuite s'identifier à l'aide de son
                        identifiant et de son mot de passe qui lui seront
                        communiqués après son inscription.<br/>
                        Tout Utilisateur membre régulièrement inscrit pourra également solliciter sa désinscription
                        en se rendant à la page dédiée sur son
                        espace personnel. Celle-ci sera effective dans un délai raisonnable.<br/>
                        Tout événement dû à un cas de force majeure ayant pour conséquence un dysfonctionnement du
                        site ou serveur et sous réserve
                        de toute interruption ou modification en cas de maintenance, n'engage pas la responsabilité
                        de https://test-place.com.<br/> Dans ces
                        cas, l’Utilisateur accepte ainsi ne pas tenir rigueur à l’éditeur de toute interruption ou
                        suspension de service, même sans préavis.<br/>
                        L'Utilisateur a la possibilité de contacter le site par messagerie électronique à l’adresse
                        email de l’éditeur communiqué à
                        l’ARTICLE 1.

                    </div>

                    <h2>
                        ARTICLE 3 : COLLECTE DES DONNÉES

                    </h2>

                    <div className="text-muted font-weight-light text-left mb-5">
                        Le site assure à l'Utilisateur une collecte et un traitement d'informations personnelles
                        dans le respect de la vie privée
                        conformément à la loi n°78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et
                        aux libertés. Le site est déclaré à la CNIL
                        sous le numéro 000000000000.<br/>
                        En vertu de la loi Informatique et Libertés, en date du 6 janvier 1978, l'Utilisateur
                        dispose d'un droit d'accès, de rectification, de
                        suppression et d'opposition de ses données personnelles.<br/> L'Utilisateur exerce ce droit
                        :
                        · via un formulaire de contact ;<br/>
                        · via son espace personnel ;
                    </div>

                    <h2>
                        ARTICLE 4 : PROPRIÉTÉ INTELLECTUELLE
                    </h2>

                    <div className="text-muted font-weight-light text-left mb-5">
                        Les marques, logos, signes ainsi que tous les contenus du site (textes, images, son…) font
                        l'objet d'une protection par le Code de
                        la propriété intellectuelle et plus particulièrement par le droit d'auteur.<br/>
                        L'Utilisateur doit solliciter l'autorisation préalable du site pour toute reproduction,
                        publication, copie des différents contenus.<br/> Il
                        s'engage à une utilisation des contenus du site dans un cadre strictement privé, toute
                        utilisation à des fins commerciales et
                        publicitaires est strictement interdite.<br/>
                        Toute représentation totale ou partielle de ce site par quelque procédé que ce soit, sans
                        l’autorisation expresse de l’exploitant du
                        site Internet constituerait une contrefaçon sanctionnée par l’article L 335-2 et suivants du
                        Code de la propriété intellectuelle.<br/>
                        Il est rappelé conformément à l’article L122-5 du Code de propriété intellectuelle que
                        l’Utilisateur qui reproduit, copie ou publie le
                        contenu protégé doit citer l’auteur et sa source
                    </div>


                    <h2>
                        ARTICLE 5 : RESPONSABILITÉ
                    </h2>

                    <div className="text-muted font-weight-light text-left mb-5">
                        Les sources des informations diffusées sur le site https://test-place.com sont réputées
                        fiables mais le site ne garantit pas qu’il soit
                        exempt de défauts, d’erreurs ou d’omissions.<br/>
                        Les informations communiquées sont présentées à titre indicatif et général sans valeur
                        contractuelle. <br/>Malgré des mises à jour
                        régulières, le site https://test-place.com ne peut être tenu responsable de la modification
                        des dispositions administratives et
                        juridiques survenant après la publication.<br/> De même, le site ne peut être tenue
                        responsable de l’utilisation et de l’interprétation de
                        l’information contenue dans ce site.<br/>
                        L'Utilisateur s'assure de garder son mot de passe secret. <br/>Toute divulgation du mot de
                        passe, quelle que soit sa forme, est
                        interdite. <br/>Il assume les risques liés à l'utilisation de son identifiant et mot de
                        passe.<br/> Le site décline toute responsabilité.<br/>
                        Le site https://test-place.com ne peut être tenu pour responsable d’éventuels virus qui
                        pourraient infecter l’ordinateur ou tout
                        matériel informatique de l’Internaute, suite à une utilisation, à l’accès, ou au
                        téléchargement provenant de ce site.<br/>
                        La responsabilité du site ne peut être engagée en cas de force majeure ou du fait
                        imprévisible et insurmontable d'un tiers
                    </div>

                    <h2>
                        ARTICLE 6 : LIENS HYPERTEXTES
                    </h2>

                    <div className="text-muted font-weight-light text-left mb-5">
                        Des liens hypertextes peuvent être présents sur le site.<br/> L’Utilisateur est informé
                        qu’en cliquant sur ces liens, il sortira du site
                        https://test-place.com. <br/>Ce dernier n’a pas de contrôle sur les pages web sur lesquelles
                        aboutissent ces liens et ne saurait, en
                        aucun cas, être responsable de leur contenu.

                    </div>

                    <h2>
                        ARTICLE 7 : COOKIES
                    </h2>

                    <div className="text-muted font-weight-light text-left mb-5">
                        L’Utilisateur est informé que lors de ses visites sur le site, un cookie peut s’installer
                        automatiquement sur son logiciel de
                        navigation. <br/>
                        Les cookies sont de petits fichiers stockés temporairement sur le disque dur de l’ordinateur
                        de l’Utilisateur par votre navigateur et
                        qui sont nécessaires à l’utilisation du site https://test-place.com. <br/> Les cookies ne
                        contiennent pas d’information personnelle et ne
                        peuvent pas être utilisés pour identifier quelqu’un. <br/>Un cookie contient un identifiant
                        unique, généré aléatoirement et donc
                        anonyme. <br/>Certains cookies expirent à la fin de la visite de l’Utilisateur, d’autres
                        restent. <br/>
                        L’information contenue dans les cookies est utilisée pour améliorer le site
                        https://test-place.com. <br/>
                        En naviguant sur le site, L’Utilisateur les accepte. <br/>
                        L’Utilisateur doit toutefois donner son consentement quant à l’utilisation de certains
                        cookies. <br/>
                        A défaut d’acceptation, l’Utilisateur est informé que certaines fonctionnalités ou pages
                        risquent de lui être refusées. <br/>
                        L’Utilisateur pourra désactiver ces cookies par l’intermédiaire des paramètres figurant au
                        sein de son logiciel de navigation.

                    </div>

                    <h2>
                        ARTICLE 8 : PUBLICATION PAR L’UTILISATEUR
                    </h2>
                    <div className="text-muted font-weight-light text-left mb-5">
                        Le site permet aux membres de publier les contenus suivants :
                        Produits à tester.<br/>
                        Dans ses publications, le membre s’engage à respecter les règles de la Netiquette (règles de
                        bonne conduite de l’internet) et les
                        règles de droit en vigueur.<br/>
                        Le site peut exercer une modération sur les publications et se réserve le droit de refuser
                        leur mise en ligne, sans avoir à s’en
                        justifier auprès du membre.<br/>
                        Le membre reste titulaire de l’intégralité de ses droits de propriété
                        intellectuelle.<br/> Mais en publiant une publication sur le site, il
                        cède à la société éditrice le droit non exclusif et gratuit de représenter, reproduire,
                        adapter, modifier, diffuser et distribuer sa
                        publication, directement ou par un tiers autorisé, dans le monde entier, sur tout support
                        (numérique ou physique), pour la durée
                        de la propriété intellectuelle.<br/> Le Membre cède notamment le droit d'utiliser sa
                        publication sur internet et sur les réseaux de
                        téléphonie mobile.<br/>
                        La société éditrice s'engage à faire figurer le nom du membre à proximité de chaque
                        utilisation de sa publication.<br/>
                        Tout contenu mis en ligne par l'Utilisateur est de sa seule responsabilité. <br/>L'Utilisateur
                        s'engage à ne pas mettre en ligne de
                        contenus pouvant porter atteinte aux intérêts de tierces personnes.<br/> Tout recours en
                        justice engagé par un tiers lésé contre le site
                        sera pris en charge par l'Utilisateur.<br/>
                        Le contenu de l'Utilisateur peut être à tout moment et pour n'importe quelle raison supprimé
                        ou modifié par le site, sans préavis.


                    </div>
                    <h2>
                        ARTICLE 9 : DROIT APPLICABLE ET JURIDICTION COMPÉTENTE
                    </h2>
                    <div className="text-muted font-weight-light text-left mb-5">
                        La législation française s'applique au présent contrat. <br/>En cas d'absence de résolution
                        amiable d'un litige né entre les parties, les
                        tribunaux français seront seuls compétents pour en connaître.<br/>
                        Pour toute question relative à l’application des présentes CGU, vous pouvez joindre
                        l’éditeur aux coordonnées inscrites à
                        l’ARTICLE 1.<br/>
                        Réalisé sur https://www.legalplace.fr
                    </div>
                </div>
                <div className="modal-footer">
                    <Button
                        color="secondary"
                        data-dismiss="modal"
                        type="button"
                        onClick={toggleModal}
                    >
                        {t("CLOSE")}
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default withTranslation()(PrivacyPolicyModal);