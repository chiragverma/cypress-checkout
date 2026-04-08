import './commands';

// Suppress known third-party exceptions that don't affect test outcomes.
// All other uncaught exceptions will propagate and fail the test as expected.
Cypress.on('uncaught:exception', (err) => {
  const knownThirdPartyErrors = [
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    // Stripe Express Checkout (Apple Pay / Google Pay) fails to mount when the
    // embedded checkout page is visited directly outside its intended iframe context.
    // This does not affect the card payment form we are testing.
    "expressCheckout Element didn't mount normally",
    // Stripe telemetry endpoint unreachable in the Cypress test environment.
    'Error fetching https://r.stripe.com/b',
  ];

  if (knownThirdPartyErrors.some((msg) => err.message.includes(msg))) {
    return false;
  }

  return true;
});
