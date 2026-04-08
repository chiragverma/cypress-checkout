/*
 Spike Testing is a type of stress test that checks how the system performs when there are sudden and massive spikes in the number of users.

 Run a spike test to:
 - Determine how your system performs under sudden large spikes of traffic
 - Determine if your system will recover once the spike subsides
 - Observe how quickly the system scales up and back down

 Simulates a flash sale or viral traffic event
*/

import http from "k6/http";
import { sleep } from 'k6';
import encoding from 'k6/encoding';

export let options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  stages: [
    { duration: '10s', target: 100 },  // normal load
    { duration: '1m',  target: 100 },  // stay at normal load
    { duration: '10s', target: 500 },  // spike to 500 users instantly
    { duration: '3m',  target: 500 },  // stay at spike
    { duration: '10s', target: 100 },  // drop back to normal
    { duration: '3m',  target: 100 },  // recover at normal load
    { duration: '10s', target: 0 },    // ramp-down to 0 users
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
