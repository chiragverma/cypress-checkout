const futureExpiry = () => `12${(new Date().getFullYear() + 10).toString().slice(-2)}`;

export const SELECTORS = {
  // Form fields
  email: '#email',
  cardNumber: '#cardNumber',
  cardExpiry: '#cardExpiry',
  cardCvc: '#cardCvc',
  billingName: '#billingName',
  // Country must be selected first; postal code input only renders after that
  billingCountry: '#billingCountry',
  postalCode: '#billingPostalCode',

  // Submit button states
  submitButton: '.SubmitButton',
  submitEnabled: '.SubmitButton--complete',
  submitDisabled: '.SubmitButton--incomplete',

  // Result indicators
  successIcon: '.SubmitButton-CheckmarkIcon--current',

  // Required-field error messages.
  // The card fieldset id contains a dynamic list of supported networks, so use
  // an attribute-starts-with selector instead of an exact id match.
  requiredEmail: '#required-email-fieldset',
  requiredCardDetails: '[id^="required-cardNumber-"]',
  requiredBillingName: '#required-billingName-fieldset',
};

/**
 * Page Object for the Stripe Checkout form.
 * Groups field-level validation actions and required-field message assertions.
 */
class CheckoutPage {
  static validateEmail() {
    cy.get(SELECTORS.email).should('have.attr', 'aria-invalid', 'false');
    cy.get(SELECTORS.email).clear().type('invalid@');
    cy.focused().blur();
    cy.get(SELECTORS.email).should('have.attr', 'aria-invalid', 'true');
    cy.get(SELECTORS.email).clear().type('test@example.com');
    cy.focused().blur();
    cy.get(SELECTORS.email).should('have.attr', 'aria-invalid', 'false');
  }

  static validateCardNumber() {
    cy.get(SELECTORS.cardNumber).should('have.attr', 'aria-invalid', 'false');
    cy.get(SELECTORS.cardNumber).clear().type('1111111111111111');
    cy.get(SELECTORS.cardNumber).should('have.attr', 'aria-invalid', 'true');
    cy.get(SELECTORS.cardNumber).clear().type('4242424242424242');
    cy.get(SELECTORS.cardNumber).should('have.attr', 'aria-invalid', 'false');
  }

  static validateCardExpiry() {
    cy.get(SELECTORS.cardExpiry).should('have.attr', 'aria-invalid', 'false');
    cy.get(SELECTORS.cardExpiry).clear().type('1111');
    cy.get(SELECTORS.cardExpiry).should('have.attr', 'aria-invalid', 'true');
    cy.get(SELECTORS.cardExpiry).clear().type(futureExpiry());
    cy.get(SELECTORS.cardExpiry).should('have.attr', 'aria-invalid', 'false');
  }

  static validateCardCvc() {
    cy.get(SELECTORS.cardCvc).should('have.attr', 'aria-invalid', 'false');
    cy.get(SELECTORS.cardCvc).clear().type('12');
    cy.focused().blur();
    cy.get(SELECTORS.cardCvc).should('have.attr', 'aria-invalid', 'true');
    cy.get(SELECTORS.cardCvc).clear().type('123');
    cy.focused().blur();
    cy.get(SELECTORS.cardCvc).should('have.attr', 'aria-invalid', 'false');
  }

  static validatePostalCode() {
    // Postal code input only renders after a country is selected
    cy.get(SELECTORS.billingCountry).select('US');
    cy.get(SELECTORS.postalCode).should('have.attr', 'aria-invalid', 'false');
    cy.get(SELECTORS.postalCode).clear().type('12');
    cy.focused().blur();
    cy.get(SELECTORS.postalCode).should('have.attr', 'aria-invalid', 'true');
    cy.get(SELECTORS.postalCode).clear().type('94043');
    cy.focused().blur();
    cy.get(SELECTORS.postalCode).should('have.attr', 'aria-invalid', 'false');
  }

  /** Submits an empty form; all three required-field errors should appear. */
  static verifyRequiredFields() {
    cy.get(SELECTORS.submitButton).click();
    cy.get(SELECTORS.requiredEmail).should('contain.text', 'Required');
    cy.get(SELECTORS.requiredCardDetails).should('contain.text', 'Required');
    cy.get(SELECTORS.requiredBillingName).should('contain.text', 'Required');
  }

  /** Fills email; card and name required errors should remain. */
  static verifyRequiredFieldsAfterEmail() {
    cy.get(SELECTORS.email).type('test@example.com');
    cy.get(SELECTORS.requiredEmail).should('not.exist');
    cy.get(SELECTORS.requiredCardDetails).should('contain.text', 'Required');
    cy.get(SELECTORS.requiredBillingName).should('contain.text', 'Required');
  }

  /** Fills card details; only the name required error should remain. */
  static verifyRequiredFieldsAfterCard() {
    cy.get(SELECTORS.cardNumber).type('4242424242424242');
    cy.get(SELECTORS.cardExpiry).type(futureExpiry());
    cy.get(SELECTORS.cardCvc).type('424');
    cy.get(SELECTORS.requiredCardDetails).should('not.exist');
    cy.get(SELECTORS.requiredBillingName).should('contain.text', 'Required');
  }

  /** Fills name; no required errors should remain. */
  static verifyNoRequiredFields() {
    cy.get(SELECTORS.billingName).type('Test User');
    cy.get(SELECTORS.requiredEmail).should('not.exist');
    cy.get(SELECTORS.requiredCardDetails).should('not.exist');
    cy.get(SELECTORS.requiredBillingName).should('not.exist');
  }
}

export default CheckoutPage;
