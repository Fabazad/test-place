import '@testing-library/cypress/add-commands';

context('Login', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('Log in and log out', () => {
        cy.findByTestId('login-button').click();
        cy.findByTestId('login-email-input').type("fabazad@live.fr");
        cy.findByTestId('login-password-input').type('azertyuiop');
        cy.findByTestId('submit-login-button').click();
        cy.findByTestId('logout-button').click();
    });

    it('Log in fail', () => {
        cy.findByTestId('login-button').click();
        cy.findByTestId('login-email-input').type("fabazad@live.fr");
        cy.findByTestId('login-password-input').type('wrong-password');
        cy.findByTestId('submit-login-button').click();
        cy.get('.Toastify').find('[role=alert]').contains('Incorrect email or password');
    });
});