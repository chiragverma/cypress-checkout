import http from "k6/http";
import { check, sleep } from "k6";
import encoding from "k6/encoding";

// Replace with your Stripe test secret key
const STRIPE_SECRET_KEY = __ENV.STRIPE_SECRET_KEY || "sk_test_your_key_here";
const BASE_URL = "https://api.stripe.com/v1";

const params = {
  headers: {
    Authorization: `Basic ${encoding.b64encode(STRIPE_SECRET_KEY + ":")}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

export const options = {
  stages: [
    { duration: "5m", target: 100 }, // ramp up to 100 users
    { duration: "10m", target: 100 }, // hold at 100 users
    { duration: "5m", target: 0 },   // ramp down
  ],
  thresholds: {
    http_req_duration: ["p(99)<2000"], // 99% of requests must complete below 2000ms
  },
};

export default function () {
  // 1. Create a Payment Intent
  const createPI = http.post(
    `${BASE_URL}/payment_intents`,
    "amount=1940&currency=usd&payment_method_types[]=card",
    params
  );

  check(createPI, {
    "create payment intent status 200": (r) => r.status === 200,
    "create payment intent has id": (r) => JSON.parse(r.body).id !== undefined,
  });

  const paymentIntentId = JSON.parse(createPI.body).id;

  // 2. Create a Payment Method using test card
  const createPM = http.post(
    `${BASE_URL}/payment_methods`,
    "type=card&card[number]=4242424242424242&card[exp_month]=12&card[exp_year]=2026&card[cvc]=424",
    params
  );

  check(createPM, {
    "create payment method status 200": (r) => r.status === 200,
    "create payment method has id": (r) => JSON.parse(r.body).id !== undefined,
  });

  const paymentMethodId = JSON.parse(createPM.body).id;

  // 3. Batch: retrieve payment intent + list payment intents
  const responses = http.batch([
    ["GET", `${BASE_URL}/payment_intents/${paymentIntentId}`, null, params],
    ["GET", `${BASE_URL}/payment_intents?limit=5`, null, params],
  ]);

  check(responses[0], {
    "retrieve payment intent status 200": (r) => r.status === 200,
    "retrieve payment intent matches id": (r) =>
      JSON.parse(r.body).id === paymentIntentId,
  });

  check(responses[1], {
    "list payment intents status 200": (r) => r.status === 200,
    "list payment intents has data": (r) =>
      JSON.parse(r.body).data.length > 0,
  });

  // 4. Confirm Payment Intent with test card (decline scenario)
  const confirmDecline = http.post(
    `${BASE_URL}/payment_intents/${paymentIntentId}/confirm`,
    `payment_method=${paymentMethodId}`,
    params
  );

  check(confirmDecline, {
    "confirm payment intent responded": (r) =>
      r.status === 200 || r.status === 402,
  });

  sleep(1);
}
