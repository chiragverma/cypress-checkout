import { SELECTORS } from '../pages/CheckoutPage.js';

describe('Checkout - Server Error', () => {
  beforeEach(() => {
    cy.visitCheckout();
  });

  it('does not show the success icon when the payment confirmation returns a 500', () => {
    cy.intercept('POST', 'https://api.stripe.com/v1/payment_methods', {
      fixture: 'payment-method-response.json',
    }).as('createPaymentMethod');

    cy.intercept('POST', 'https://api.stripe.com/v1/payment_pages/*/confirm', {
      statusCode: 500,
      body: { error: { type: 'api_error', message: 'An error occurred while processing your card.' } },
    }).as('confirmPayment');

    cy.fillCheckout();

    cy.wait('@createPaymentMethod');
    cy.wait('@confirmPayment');

    cy.get(SELECTORS.successIcon).should('not.exist');
    cy.get(SELECTORS.submitButton).should('be.visible');
  });
});
