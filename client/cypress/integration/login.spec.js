import '@testing-library/cypress/add-commands';

const login = cy => {
    cy.findByTestId('login-button').click();
    cy.findByTestId('login-email-input').type("fabazad@live.fr");
    cy.findByTestId('login-password-input').type('azertyuiop');
    cy.findByTestId('submit-login-button').click();
};

context('Login', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('Log in and log out', () => {
        login(cy);
        cy.findByTestId('logout-button').click();
    });

    it('Log in fail', () => {
        cy.findByTestId('login-button').click();
        cy.findByTestId('login-email-input').type("fabazad@live.fr");
        cy.findByTestId('login-password-input').type('wrong-password');
        cy.findByTestId('submit-login-button').click();
        cy.get('.Toastify').find('[role=alert]').contains('Incorrect email or password');
    });

    it('Sign it', () => {
        cy.findByTestId('signin-button').click();
        cy.findByTestId('signin-name-input').type('test-cypress');
        cy.findByTestId('signin-email-input').type('cypress@test.com');
        cy.findByTestId('signin-password-input').type('password');
        cy.findByTestId('signin-password2-input').type('password');
        cy.findByTestId('signin-agree-input').check({force: true});
        cy.findByTestId('signin-submit-button').click();
    });
});

export default { login };