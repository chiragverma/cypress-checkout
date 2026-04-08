import { SELECTORS } from '../pages/CheckoutPage.js';

describe('Checkout - Payment Success', () => {
  beforeEach(() => {
    cy.visitCheckout();
  });

  it('displays the success icon after a valid payment is submitted', () => {
    cy.intercept('POST', 'https://api.stripe.com/v1/payment_methods', {
      fixture: 'payment-method-response.json',
    }).as('createPaymentMethod');

    cy.intercept('POST', 'https://api.stripe.com/v1/payment_pages/*/confirm', {
      statusCode: 200,
      fixture: 'confirm-pass-response.json',
    }).as('confirmPayment');

    cy.fillCheckout();

    cy.wait('@createPaymentMethod');
    cy.wait('@confirmPayment');

    cy.get(SELECTORS.successIcon).should('be.visible');
  });
});
