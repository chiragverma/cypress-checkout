/*
 Run a stress test to:
 - Determine how your system behaves under extreme conditions
 - Find the maximum capacity before the system breaks
 - Observe how the system recovers after breaking point

 Gradually increases load beyond normal levels to find breaking point
*/

import http from "k6/http";
import { sleep } from 'k6';
import encoding from 'k6/encoding';

export let options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  stages: [
    { duration: '2m', target: 100 },  // ramp up to normal load
    { duration: '5m', target: 100 },  // stay at normal load
    { duration: '2m', target: 200 },  // push beyond normal
    { duration: '5m', target: 200 },  // stay at breaking point
    { duration: '2m', target: 300 },  // push to maximum
    { duration: '5m', target: 300 },  // stay at maximum
    { duration: '5m', target: 0 },    // ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(99)<2000'], // 99% of requests must complete below 2000ms
  },
};

const BASE_URL = 'https://api.stripe.com/v1';
const STRIPE_SECRET_KEY = __ENV.STRIPE_SECRET_KEY || 'sk_test_your_key_here';
const BASIC_AUTH = 'Basic ' + encoding.b64encode(STRIPE_SECRET_KEY + ':');

const authHeaders = {
  headers: { 'Authorization': BASIC_AUTH },
};

const postHeaders = {
  headers: {
    'Authorization': BASIC_AUTH,
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
      'card[token]': 'tok_visa',
    },
    params: postHeaders,
  };

  let req4 = {
    method: 'GET',
    url: BASE_URL+'/charges?limit=3',
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
