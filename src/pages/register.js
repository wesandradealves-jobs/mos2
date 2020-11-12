import React from 'react';

const domains = [
  'http://localhost',
  'http://localhost:3000',
  'http://localhost:5000',
  'https://dev.spotmetrics.com',
  'https://demo.spotmetrics.com',
  'https://staging.spotmetrics.com',
  'https://mos.spotmetrics.com',
];

function messageHandler(event) {
  if (!domains.includes(event.origin)) return;
  const { action, key, value } = event.data;
  if (action === 'save') {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } else if (action === 'get') {
    event.source.postMessage(
      {
        action: 'returnData',
        key: JSON.parse(window.sessionStorage.getItem(key)),
      },
      '*'
    );
  }
}

function Register() {
  window.addEventListener('message', messageHandler, false);
  return <div id="register" />;
}

export default Register;
