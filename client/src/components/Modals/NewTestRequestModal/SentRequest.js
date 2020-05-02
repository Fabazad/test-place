import AnimatedCheck from "../../AnimatedCheck";
import {Link} from "react-router-dom";
import React from "react";

const SentRequest = () => {

    return (
        <>
            <AnimatedCheck/>
            <p className="mt-5 h4">
                Votre demande de test a bien été envoyée.<br/>
                Il ne vous reste plus qu'à attendre la réponse du vendeur.<br/><br/>
                Vous pouvez suivre l'état de votre demande sur votre page<br/>
                <Link to="/dashboard/sent-requests">Mes Demandes Envoyées</Link>
            </p>
        </>
    )
};

export default SentRequest;