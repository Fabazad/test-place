import PropTypes from "prop-types";
import Label from "reactstrap/lib/Label";
import Alert from "reactstrap/es/Alert";
import {Link} from "react-router-dom";
import AnswerTestRequestForm from "../../Forms/AnswerTestRequestForm";
import React, {useEffect, useState} from "react";
import testServices from "../../../services/test.services";
import constants from "../../../helpers/constants";
import NextStepAdvice from "./NextStepAdvice";
import {getAmazonReviewUrl, getProductAmazonUrl} from "../../../helpers/urlHelpers";
import ReviewAdvices from "../../ReviewAdvices";

const {USER_ROLES} = constants;

const TestProcessInfo = ({test, userRole, onToggle, adminView}) => {

    const [statuses, setStatuses] = useState({});
    useEffect(() => {
        testServices.getTestStatuses().then(setStatuses);
    }, []);

    const onAnswerTestSubmit = () => {
        testServices.testsSubject.next();
        onToggle();
    };

    const isStatus = statusesToCheck => {
        if (typeof statusesToCheck === "string") {
            return statuses[statusesToCheck] === test.status;
        }
        return statusesToCheck.map(status => statuses[status]).includes(test.status);
    };

    return (
        <>
            {isStatus('requestCancelled') && test.cancelRequestReason ?
                <div className="text-center w-100">
                    <Label>Raison de l'annulation</Label>
                    <Alert color="default" className="white-space-pre-line">
                        {test.cancelRequestReason}
                    </Alert>
                </div> : null}
            {isStatus('requestDeclined') && test.declineRequestReason ?
                <div className="text-center w-100">
                    <Label>Raison du refus</Label>
                    <Alert color="danger" className="white-space-pre-line">
                        {test.declineRequestReason}
                    </Alert>
                </div> : null}
            {isStatus('requested') && (USER_ROLES.TESTER === userRole || adminView) ?
                <NextStepAdvice color="info">
                    En attente d'acceptation de la demande de test.<br/>
                    Pour l'instant, tout ce que vous avez à faire est d'attendre la réponse du vendeur.<br/>
                    N'achetez donc pas encore le produit.
                </NextStepAdvice> : null}
            {test.testerMessage ?
                <div className="text-left w-100">
                    <Label>Message du Testeur - {test.tester.name}</Label>
                    <Alert color="success" className="white-space-pre-line">
                        {test.testerMessage}
                    </Alert>
                </div> : null}
            {isStatus('requested') && (USER_ROLES.SELLER === userRole || adminView) ?
                <div className="text-center bg-secondary p-3 w-100 rounded">
                    <AnswerTestRequestForm onSubmit={onAnswerTestSubmit} testId={test._id}/>
                </div> : null}
            {test.sellerMessage ?
                <div className="text-left w-100">
                    {test.sellerMessage ?
                        <div className="mb-3">
                            <Label>Message du Vendeur - {test.seller.name}</Label>
                            <Alert color="success" className="white-space-pre-line">
                                {test.sellerMessage}
                            </Alert>
                        </div> : null}
                </div> : null
            }
            {isStatus('requestAccepted') && (USER_ROLES.TESTER === userRole || adminView) ?
                <NextStepAdvice color="success">
                    Commandez le produit sur le site Amazon en suivant ce lien :&nbsp;
                    <a href={getProductAmazonUrl(test.product.asin, test.product.keywords)} target='_blank'
                       rel="noopener noreferrer">
                        Lien Produit
                    </a>.<br/>
                    Indiquez sur votre page <Link to='/dashboard/my-current-tests'>Mes Tests en Cours</Link> lorsque
                    vous commandez.<br/>
                    Recevez votre colis, testez le, laissez un avis et recevez votre remboursement.
                </NextStepAdvice> : null
            }
            {isStatus(['requestAccepted', 'productOrdered', 'productReceived']) && (USER_ROLES.SELLER === userRole || adminView) ?
                <NextStepAdvice color="info">
                    Attendez que le Testeur achète et test le produit.<br/>
                    Le Testeur est informé par l'application des conseils suivants :<br/>
                    <ReviewAdvices/>
                    Vous pouvez suivre l'avancer du test sur votre page
                    <Link to={'/dashboard/my-current-tests'}> Mes Tests en Cours</Link>.<br/>
                    Vous serez aussi notifié de l'avancée.
                </NextStepAdvice> : null}
            {isStatus('productOrdered') && (USER_ROLES.TESTER === userRole || adminView) ?
                <NextStepAdvice color="info">
                    Dès que vous recevez le colis, indiquez le.<br/>
                    Ensuite testez le et laissez un avis pour recevoir votre remboursement.
                </NextStepAdvice> : null}
            {isStatus('productReceived') && (USER_ROLES.TESTER === userRole || adminView) ?
                <NextStepAdvice color="info">
                    Testez votre produit et laissez un avis sur Amazon.<br/>
                    Attention, voici quelques conseils pour garder vos notes Amazon :<br/>
                    <ReviewAdvices/>
                    L'avis met plusieurs jours avant d'être validé par Amazon.<br/>
                    Lorsque celui est validé, vous pouvez passer à l'étape suivante.<br/>
                    Vous recevrez votre remboursement dès que le Vendeur aura validé votre avis Amazon.
                </NextStepAdvice> : null}
            {isStatus('productReviewed') && (USER_ROLES.TESTER === userRole || adminView) ?
                <NextStepAdvice color="info">
                    Vous n'avez plus qu'à attendre que le Vendeur accepte votre avis Amazon.<br/>
                    Il vous enverra ensuite le remboursement.
                </NextStepAdvice> : null}
            {isStatus('productReviewed') && (USER_ROLES.SELLER === userRole || adminView) && test.reviewId ?
                <NextStepAdvice color="info">
                    Le Testeur a indiqué avoir laissé un avis sur le produit.<br/>
                    Vous trouverez ici le <a href={getAmazonReviewUrl(test.reviewId)}>Lien de l'avis</a>.<br/>
                    C'est à vous maintenant de valider ou de rejeter l'avis.<br/>
                </NextStepAdvice> : null}
            {test.declineReviewReason ?
                <div className="text-left w-100">
                    <div className="mb-3">
                        <Label>Raison du Refus - <Link to={'#'}>{test.seller.name}</Link></Label>
                        <Alert color="danger" className="white-space-pre-line">
                            {test.declineReviewReason}
                        </Alert>
                    </div>
                </div> : null
            }
            {isStatus("reviewDeclined") && !test.adminMessage ?
                <NextStepAdvice color="info">
                    Un administrateur va s'occuper du litige.
                </NextStepAdvice> : null}
            {isStatus("reviewValidated") && (userRole === USER_ROLES.TESTER || adminView) ?
                <NextStepAdvice color="info">
                    Félicitations, votre avis a été validé par le Vendeur !<br/>
                    Il va maintenant procéder au remboursement sur votre compte Paypal.<br/>
                    Il faut compter parfois quelques jours chez certains Vendeurs.<br/>
                    Vous serez notifié lorsque l'argent sera envoyé.<br/>
                    N'hésitez pas à <Link to="/#contact-us">nous contacter</Link>, avec le numéro de commande, si cela
                    prend plus d'une semaine.
                </NextStepAdvice> : null
            }
            {isStatus("reviewValidated") && (userRole === USER_ROLES.SELLER || adminView) ?
                <NextStepAdvice color="info">
                    Nous sommes heureux que tout se soit bien passé !<br/>
                    Maintenant, c'est à vous de remplir votre part du marché.<br/>
                    C'est le moment de rembourser par Paypal le Testeur.<br/>
                    Somme à rembourser : {test.product.price}€ - {test.product.finalPrice}€.<br/>
                    Soit {test.product.price - test.product.finalPrice}€.
                </NextStepAdvice> : null
            }
            {isStatus("testCancelled") && test.cancelReason ?
                <>
                    <Label>Raison de l'annulation ou la réclamation :</Label>
                    <Alert color="danger">
                        <br/>
                        <i className="white-space-pre-line">{test.cancelReason}</i><br/><br/>
                        Un administrateur va juger la raison.<br/>
                        Vous serez informés par les décisions prises.
                    </Alert>
                </> : null
            }
            {test.adminMessage ?
                <>
                    <Label>Message de l'Admin :</Label>
                    <Alert color="warning">
                        <span className="white-space-pre-line">{test.adminMessage}</span>
                    </Alert>
                </> : null}
        </>
    )
};

TestProcessInfo.propTypes = {
    test: PropTypes.object.isRequired,
    userRole: PropTypes.string.isRequired,
    onToggle: PropTypes.func.isRequired,
    adminView: PropTypes.bool
};

export default TestProcessInfo;