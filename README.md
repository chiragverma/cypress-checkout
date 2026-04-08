# Boiler plate for testing UI and mocking Stripe API - https://checkout.stripe.dev/preview

This uses Cypress, Docker, Mocking APIs and Github actions

Tests runs automatically on new commits and there is a also a manual workflow in the Actions as well where the tests can be triggered manually


![alt text](StripePage.png)


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
