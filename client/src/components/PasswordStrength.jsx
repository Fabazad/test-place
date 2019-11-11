import React from "react";

class PasswordStrength extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
          score: 0
        };
      }

    scorePassword(pass) {
        var score = 0;
        if (!pass)
            return score;
  
        // award every unique letter until 5 repetitions
        var letters = new Object();
        for (var i=0; i<pass.length; i++) {
            letters[pass[i]] = (letters[pass[i]] || 0) + 1;
            score += 5.0 / letters[pass[i]];
        }
  
        // bonus points for mixing it up
        var variations = {
            digits: /\d/.test(pass),
            lower: /[a-z]/.test(pass),
            upper: /[A-Z]/.test(pass),
            nonWords: /\W/.test(pass),
        }
  
        var variationCount = 0;
        for (var check in variations) {
            variationCount += (variations[check] == true) ? 1 : 0;
        }
        score += (variationCount - 1) * 10;
  
        return parseInt(score);
    }

    formatPasswordStrength() {
        const score = this.scorePassword(this.props.password);
        if (this.props.password.length < this.props.min) {
            return (<span className="text-danger font-weight-700">Trop court</span>);
        }
        else if (score > 70) {
            return (<span className="text-success font-weight-700">Fort</span>);
        }
        else if (score > 40) {
            return (<span className="text-warning font-weight-700">Moyen</span>);
        }
        else {
            return (<span className="text-danger font-weight-700">Faible</span>);
        }
    }

    render() {
        return (
        <>
            <div className="text-muted font-italic">
                <small>
                    Force du Mot de passe :{" "}
                    { this.formatPasswordStrength() }
                </small>
            </div>
        </>
        );
    }
}

export default PasswordStrength;
