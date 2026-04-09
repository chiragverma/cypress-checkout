import { SELECTORS } from '../pages/CheckoutPage.js';

/**
 * Fetches a fresh Stripe Checkout demo session and navigates to the checkout page.
 * Relies on the `demoSessionUrl` env variable defined in cypress.config.js.
 */
Cypress.Commands.add('visitCheckout', () => {
  cy.request(Cypress.env('demoSessionUrl')).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('url');
    cy.visit(response.body.url);
  });
});

/**
 * Fills in all checkout form fields using fixture data and submits the form.
 * Asserts that the button transitions to "Processing" after submission.
 */
Cypress.Commands.add('fillCheckout', () => {
  cy.fixture('user.json').then((user) => {
    const expiryYear = (new Date().getFullYear() + 10).toString().slice(-2);
    cy.get(SELECTORS.email).should('be.visible').type(user.email);
    cy.get(SELECTORS.cardNumber).should('be.visible').type(user.cardNumber);
    cy.get(SELECTORS.cardExpiry).should('be.visible').type(`12${expiryYear}`);
    cy.get(SELECTORS.cardCvc).should('be.visible').type(user.cvc);
    cy.get(SELECTORS.billingName).should('be.visible').type(user.name);
    // Country must be selected before the postal code input is rendered
    cy.get(SELECTORS.billingCountry).select('US');
    cy.get(SELECTORS.postalCode).should('be.visible').type(user.postalCode);
    cy.get(SELECTORS.submitEnabled).should('be.visible');
    cy.get(SELECTORS.submitButton).click();
    cy.get(SELECTORS.submitButton).should('contain.text', 'Processing');
  });
});
