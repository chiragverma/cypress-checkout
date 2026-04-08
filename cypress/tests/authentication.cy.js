describe('Checkout - 3D Secure Authentication Failure', () => {
  beforeEach(() => {
    cy.visitCheckout();
  });

  it('displays an authentication failure message when 3D Secure verification cannot be completed', () => {
    cy.intercept('POST', 'https://api.stripe.com/v1/payment_methods', {
      fixture: 'payment-method-response.json',
    }).as('createPaymentMethod');

    cy.intercept('POST', 'https://api.stripe.com/v1/payment_pages/*/confirm', {
      statusCode: 402,
      fixture: 'confirm-auth-response.json',
    }).as('confirmPayment');

    cy.fillCheckout();

    cy.wait('@createPaymentMethod');
    cy.wait('@confirmPayment');

    cy.contains(
      'We are unable to authenticate your payment method. Please choose a different payment method and try again.'
    ).should('be.visible');
  });
});
