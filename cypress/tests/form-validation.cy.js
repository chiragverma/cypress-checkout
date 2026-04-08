import CheckoutPage, { SELECTORS } from '../pages/CheckoutPage.js';

describe('Checkout - Form Validation', () => {
  beforeEach(() => {
    cy.visitCheckout();
  });

  it('shows "Required" errors for all mandatory fields when submitted empty', () => {
    CheckoutPage.verifyRequiredFields();
    CheckoutPage.verifyRequiredFieldsAfterEmail();
    CheckoutPage.verifyRequiredFieldsAfterCard();
    CheckoutPage.verifyNoRequiredFields();
  });

  it('shows inline errors for invalid field inputs and clears them when corrected', () => {
    CheckoutPage.validateEmail();
    CheckoutPage.validateCardNumber();
    CheckoutPage.validateCardExpiry();
    CheckoutPage.validateCardCvc();
    CheckoutPage.validatePostalCode();
  });

  it('keeps the submit button disabled until all required fields are valid', () => {
    cy.get(SELECTORS.submitDisabled).should('exist');

    // Select country first so the postal code field is required throughout
    cy.get(SELECTORS.billingCountry).select('US');
    cy.get(SELECTORS.submitDisabled).should('exist');

    cy.get(SELECTORS.email).type('test@example.com');
    cy.get(SELECTORS.submitDisabled).should('exist');

    cy.get(SELECTORS.cardNumber).type('4242424242424242');
    cy.get(SELECTORS.submitDisabled).should('exist');

    cy.get(SELECTORS.cardExpiry).type('1128');
    cy.get(SELECTORS.submitDisabled).should('exist');

    cy.get(SELECTORS.cardCvc).type('424');
    cy.get(SELECTORS.submitDisabled).should('exist');

    cy.get(SELECTORS.billingName).type('Test User');
    cy.get(SELECTORS.submitDisabled).should('exist');

    cy.get(SELECTORS.postalCode).type('94043');
    cy.get(SELECTORS.submitEnabled).should('exist');
  });
});
