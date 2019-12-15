import React from "react";
import { withTranslation } from 'react-i18next';

class PasswordStrength extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            score: 0
        };
    }

    scorePassword(pass) {
        let score = 0;
        if (!pass)
            return score;

        // award every unique letter until 5 repetitions
        let letters = {};
        for (let i = 0; i < pass.length; i++) {
            letters[pass[i]] = (letters[pass[i]] || 0) + 1;
            score += 5.0 / letters[pass[i]];
        }

        // bonus points for mixing it up
        let variations = {
            digits: /\d/.test(pass),
            lower: /[a-z]/.test(pass),
            upper: /[A-Z]/.test(pass),
            nonWords: /\W/.test(pass),
        }

        let variationCount = 0;
        for (let check in variations) {
            variationCount += (variations[check] === true) ? 1 : 0;
        }
        score += (variationCount - 1) * 10;

        return parseInt(score);
    }

    formatPasswordStrength() {
        const { t } = this.props;
        const score = this.scorePassword(this.props.password);
        if (this.props.password.length < this.props.min) {
            return (<span className="text-danger font-weight-700">{t("TOO_SHORT")}</span>);
        } else if (score > 70) {
            return (<span className="text-success font-weight-700">{t("STRONG")}</span>);
        } else if (score > 40) {
            return (<span className="text-warning font-weight-700">{t("MEDIUM")}</span>);
        } else {
            return (<span className="text-danger font-weight-700">{t("WEAK")}</span>);
        }
    }

    render() {
        const { t } = this.props;
        return (
            <>
                <div className="text-muted font-italic">
                    <small>
                        {t("PASSWORD_STRENGTH")} :{" "}
                        {this.formatPasswordStrength()}
                    </small>
                </div>
            </>
        );
    }
}

export default withTranslation()(PasswordStrength);
