// INTENTIONALLY VULNERABLE: inert CodeQL fixture for a disposable demo PR.
// This router is never imported by the application. DO NOT MERGE OR DEPLOY.
const express = require('express');
const { exec } = require('child_process');

const router = express.Router();

router.get('/ghas-demo/command', (request, response) => {
  exec(request.query.command, (error, stdout, stderr) => {
    response
      .type('text/plain')
      .send(stdout + stderr + (error ? error.message : ''));
  });
});

module.exports = router;