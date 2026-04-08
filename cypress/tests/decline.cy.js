describe('Checkout - Payment Decline', () => {
  beforeEach(() => {
    cy.visitCheckout();
  });

  it('displays a card declined error when the payment is rejected', () => {
    cy.intercept('POST', 'https://api.stripe.com/v1/payment_methods', {
      fixture: 'payment-method-response.json',
    }).as('createPaymentMethod');

    cy.intercept('POST', 'https://api.stripe.com/v1/payment_pages/*/confirm', {
      statusCode: 402,
      fixture: 'confirm-fail-response.json',
    }).as('confirmPayment');

    cy.fillCheckout();

    cy.wait('@createPaymentMethod');
    cy.wait('@confirmPayment');

    cy.contains('Your card was declined. Please try a different card').should('be.visible');
  });
});
