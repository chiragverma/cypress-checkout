# Boiler plate for testing UI and mocking Stripe API - https://checkout.stripe.dev/preview

This uses Cypress, Docker, Mocking APIs and Github actions

Tests runs automatically on new commits and there is a also a manual workflow in the Actions as well where the tests can be triggered manually


![alt text](https://github.com/chiragverma/cypress-checkout/blob/master/StripePage.png)


# To run tests locally:

```
git clone https://github.com/chiragverma/cypress-checkout.git
```

```
cd cypress-checkout
```

```
npx cypress run
```

# To run tests locally on docker:

```
docker-compose up
```

# To trigger tests manually on the CI:
Go to https://github.com/chiragverma/cypress-checkout/actions and trigger the manual workflow

# Performance Tests Using K6

We are using https://api.stripe.com/v1 for tests

There are 4 types of performance tests:
- Load Testing
- Stress Testing
- Spike Testing
- Soak Testing

To run performance tests locally:

Install K6:
```
brew install k6
```

To run tests:
```
source .env && k6 run performance-tests/tests/stripe_load_test.js
source .env && k6 run performance-tests/tests/stripe_stress_test.js
source .env && k6 run performance-tests/tests/stripe_spike_test.js
source .env && k6 run performance-tests/tests/stripe_soak_test.js
```
