import PropTypes from "prop-types";
import Label from "reactstrap/lib/Label";
import Alert from "reactstrap/es/Alert";
import {Link} from "react-router-dom";
import AnswerTestRequestForm from "../../Forms/AnswerTestRequestForm";
import React, {useEffect, useState} from "react";
import testServices from "../../../services/test.services";
import constants from "../../../helpers/constants";
import NextStepAdvice from "./NextStepAdvice";
import {getAmazonProfileUrl, getProductAmazonUrl} from "../../../helpers/urlHelpers";
import {formatDate} from "../../../helpers/textHelpers";

const {USER_ROLES} = constants;

const TestProcessInfo = props => {

    const {test, userRole, onToggle} = props;

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
                    <Alert color="default">
                        {test.cancelRequestReason}
                    </Alert>
                </div> : null}
            {isStatus('requestDeclined') && test.declineRequestReason ?
                <div className="text-center w-100">
                    <Label>Raison du refus</Label>
                    <Alert color="danger">
                        {test.declineRequestReason}
                    </Alert>
                </div> : null}
            {isStatus('requested') && USER_ROLES.TESTER === userRole ?
                <NextStepAdvice color="warning">
                    En attente d'acceptation de la demande de test.<br/>
                    Pour l'instant, tout ce que vous avez à faire est d'attendre la réponse du vendeur.<br/>
                    N'achetez donc pas encore le produit.
                </NextStepAdvice> : null}
            {isStatus('requested') && USER_ROLES.SELLER === userRole && test.testerMessage ?
                <div className="text-left w-100">
                    <Label>Message du testeur</Label>
                    <Alert color="info">
                        {test.testerMessage}
                    </Alert>
                </div> : null}
            {isStatus('requested') && USER_ROLES.SELLER === userRole ?
                <div className="text-center bg-secondary p-3 w-100 rounded">
                    <AnswerTestRequestForm onSubmit={onAnswerTestSubmit} testId={test._id}/>
                </div> : null}
            {isStatus('requestAccepted') && USER_ROLES.TESTER === userRole ?
                <>
                    <div className="text-left w-100">
                        {test.sellerMessage ?
                            <div className="mb-3">
                                <Label>Message du Vendeur - {test.seller.name}</Label>
                                <Alert color="success">
                                    {test.sellerMessage}
                                </Alert>
                            </div> : null}
                    </div>
                    <NextStepAdvice color="success">
                        Commandez le produit sur le site amazon en suivant ce lien :&nbsp;
                        <a href={getProductAmazonUrl(test.product.asin)} target='_blank' rel="noopener noreferrer">
                            Lien Produit
                        </a>.<br/>
                        Indiquez au vendeur lorsque vous commandez sur votre page
                        <Link to='/dashboard/my-current-tests'> Mes Tests en Cours</Link>.<br/>
                        Recevez votre colis, testez le, laissez un avis et recevez votre compensation financière.
                    </NextStepAdvice>
                </>
                : null}
            {isStatus(['requestAccepted', 'productOrdered', 'productReceived']) && USER_ROLES.SELLER === userRole ?
                <NextStepAdvice color="success">
                    Attendez que le testeur achète et test le produit.<br/>
                    Vous pouvez suivre l'avancer du test sur votre page
                    <Link to={'/dashboard/my-current-tests'}> Mes Tests en Cours</Link>.
                </NextStepAdvice> : null}
            {isStatus('productOrdered') && USER_ROLES.TESTER === userRole ?
                <NextStepAdvice color="success">
                    Dès que vous recevez le colis, indiquez le.<br/>
                    Ensuite testez le et laissez un avis pour recevoir votre remboursement.
                </NextStepAdvice> : null}
            {isStatus('productReceived') && USER_ROLES.TESTER === userRole ?
                <NextStepAdvice color="success">
                    Testez votre produit et laissez un avis sur Amazon.<br/>
                    Vous recevrez votre remboursement dès que le vendeur aura validé votre avis Amazon.
                </NextStepAdvice> : null}
            {isStatus('productReviewed') && USER_ROLES.TESTER === userRole ?
                <NextStepAdvice color="success">
                    Vous n'avez plus qu'à attendre que le vendeur accepte votre avis Amazon pour recevoir votre
                    remboursement.
                </NextStepAdvice> : null}
            {isStatus('productReviewed') && USER_ROLES.SELLER === userRole ?
                <NextStepAdvice color="success">
                    Le testeur a indiqué avoir laissé un avis sur le produit le&nbsp;
                    {formatDate(test.updates[test.updates.length - 1].date)}.<br/>
                    Vous pouvez facilement le vérifier sur son&nbsp;
                    <a href={getAmazonProfileUrl(test.tester.amazonId)}>Profile Amazon</a>.<br/>
                    Attention, l'avis peut mettre plusieurs jours pour être validé par Amazon et donc apparaître sur le
                    profile de l'acheteur.
                </NextStepAdvice> : null}
            {isStatus("reviewDeclined") && test.declineReviewReason ?
                <>
                    <div className="text-left w-100">
                        <div className="mb-3">
                            <Label>Raison du Refus - <Link to={'#'}>{test.seller.name}</Link></Label>
                            <Alert color="danger">
                                {test.declineReviewReason}
                            </Alert>
                        </div>
                    </div>
                    {userRole === USER_ROLES.SELLER ?
                        <NextStepAdvice color="info">
                            Un administrateur va s'occuper du litige.<br/>
                            Si la raison est considérée comme valable, vous serez remboursé.
                        </NextStepAdvice> : null}
                    {userRole === USER_ROLES.TESTER ?
                        <NextStepAdvice color="info">
                            Un administrateur va s'occuper du litige.<br/>
                            Si la raison du refus n'est pas considérée comme valable, vous recevrez tout de même votre compensation.
                        </NextStepAdvice> : null}
                </> : null}
        </>
    )
};

TestProcessInfo.propTypes = {
    test: PropTypes.object.isRequired,
    userRole: PropTypes.string.isRequired,
    onToggle: PropTypes.func.isRequired
};

export default TestProcessInfo;