/*
 Load Testing is primarily concerned with assessing the current performance of your system in terms of concurrent users or requests per second.
 When you want to understand if your system is meeting the performance goals, this is the type of test you'll run.

 Run a load test to:
 - Assess the current performance of your system under typical and peak load
 - Make sure you are continuously meeting the performance standards as you make changes to your system

 Tests cover core Stripe Checkout API operations:
 - Creating and retrieving Payment Intents
 - Creating Payment Methods using Stripe test cards
 - Listing Payment Intents
 - Confirming a Payment Intent
*/

import http from "k6/http";
import { sleep } from 'k6';

export let options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  stages: [
    { duration: '5m', target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
    { duration: '10m', target: 100 }, // stay at 100 users for 10 minutes
    { duration: '5m', target: 0 }, // ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(99)<2000'], // 99% of requests must complete below 2000ms
  },
};

const BASE_URL = 'https://api.stripe.com/v1';
const STRIPE_SECRET_KEY = __ENV.STRIPE_SECRET_KEY || 'sk_test_your_key_here';

const authHeaders = {
  headers: { 'Authorization': 'Bearer '+STRIPE_SECRET_KEY },
};

const postHeaders = {
  headers: {
    'Authorization': 'Bearer '+STRIPE_SECRET_KEY,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

export default () => {

  let req1 = {
    method: 'GET',
    url: BASE_URL+'/payment_intents?limit=5',
    params: authHeaders,
  };

  let req2 = {
    method: 'POST',
    url: BASE_URL+'/payment_intents',
    body: {
      amount: 1940,
      currency: 'usd',
      'payment_method_types[]': 'card',
    },
    params: postHeaders,
  };

  let req3 = {
    method: 'POST',
    url: BASE_URL+'/payment_methods',
    body: {
      type: 'card',
      'card[number]': '4242424242424242',
      'card[exp_month]': 12,
      'card[exp_year]': 2026,
      'card[cvc]': '424',
    },
    params: postHeaders,
  };

  let req4 = {
    method: 'GET',
    url: BASE_URL+'/payment_methods?type=card',
    params: authHeaders,
  };

  let req5 = {
    method: 'GET',
    url: BASE_URL+'/charges?limit=5',
    params: authHeaders,
  };

  http.batch([req1, req2, req3, req4, req5]);

  sleep(1);
};
