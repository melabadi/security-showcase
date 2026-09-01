/* eslint-disable */
// ============================================================
// INTENTIONALLY VULNERABLE MOCK BACKEND - FOR SECURITY DEMOS
// Do NOT deploy. Every route below contains at least one bug
// on purpose so CodeQL, Semgrep, Snyk, Trivy, and the custom
// security agent have something to find.
// ============================================================
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3');
const { execFile } = require('child_process');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const app = express();

// VULN: wildcard CORS with credentials
app.use(cors({ origin: '*', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// VULN: hardcoded secret in source. Custom secret-scanning patterns
// (see .github/secret_scanning.yml) detect the DEMO_ and SIGN- tokens
// below. We deliberately avoid real provider prefixes so this repo can
// be committed without tripping push protection — the live demo uses a
// separate branch where a real-looking token is pasted and blocked.
const JWT_SECRET = 'supersecret123';
const DEMO_INTERNAL_TOKEN = 'DEMO_0123456789ABCDEFGHIJKL';
const DEMO_SIGNING_KEY = 'SIGN-00112233445566778899AABBCCDDEEFF';

const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, pass TEXT, role TEXT)");
  db.run("INSERT INTO users (name, pass, role) VALUES ('alice','password123','user')");
  db.run("INSERT INTO users (name, pass, role) VALUES ('admin','admin','admin')");
  db.run("CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT)");
  db.run("INSERT INTO products (name) VALUES ('Laptop <b>Pro</b>')");
  db.run("INSERT INTO products (name) VALUES ('Keyboard')");
});

app.get('/api/welcome', (_req, res) => {
  // VULN: reflective markdown/HTML passed to the client (XSS vector)
  res.json({
    message:
      'Hello **demo user** — try clicking <a onclick="alert(1)" href="#">here</a>'
  });
});

// VULN: SQL injection - string concatenation on user input
app.post('/api/login', (req, res) => {
  const { user, pass } = req.body || {};
  const q = `SELECT id, name, role FROM users WHERE name='${user}' AND pass='${pass}'`;
  db.get(q, (err, row) => {
    if (err || !row) return res.status(401).json({ error: 'bad creds' });
    // VULN: weak HS256 secret
    const token = jwt.sign({ sub: row.id, role: row.role }, JWT_SECRET);
    res.json({ token, user: row.name });
  });
});

// VULN: SQL injection in search + reflected output
app.get('/api/search', (req, res) => {
  const q = req.query.q || '';
  db.all(`SELECT id, name FROM products WHERE name LIKE '%${q}%'`, (err, rows) => {
    if (err) return res.status(500).json({ error: String(err) });
    res.json(rows);
  });
});

// VULN: path traversal - user input flows straight into fs.readFile
app.get('/api/file', (req, res) => {
  const f = req.query.name || 'README.md';
  fs.readFile(path.join(__dirname, 'data', f), 'utf8', (err, data) => {
    if (err) return res.status(404).send('not found');
    res.type('text/plain').send(data);
  });
});

// VULN: SSRF - server fetches any URL the user provides
app.get('/api/proxy', async (req, res) => {
  const url = req.query.url;
  const r = await fetch(url);
  res.status(r.status).send(await r.text());
});

// Fixed: avoid shell command injection by using an allowlist + execFile
app.get('/api/admin/exec', (req, res) => {
  // Note: authN/authZ is still intentionally out of scope for this specific fix.
  const cmd = String(req.query.cmd || '');
  const rawArgs = String(req.query.args || '');

  const allowedCommands = {
    uptime: '/usr/bin/uptime',
    date: '/bin/date',
    whoami: '/usr/bin/whoami'
  };

  const file = allowedCommands[cmd];
  if (!file) {
    return res.status(400).type('text/plain').send('command not allowed');
  }

  const args = rawArgs ? rawArgs.split(',').filter(Boolean) : [];
  const safeArgPattern = /^[\w.\-/:=]+$/;
  if (!args.every((a) => safeArgPattern.test(a))) {
    return res.status(400).type('text/plain').send('invalid args');
  }

  execFile(file, args, (err, stdout, stderr) => {
    res.type('text/plain').send(stdout + stderr + (err ? err.message : ''));
  });
});

// VULN: weak JWT verification - algorithm "none" accepted
app.get('/api/me', (req, res) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256', 'none'] });
    res.json(payload);
  } catch (e) {
    res.status(401).json({ error: 'invalid token' });
  }
});

// VULN: insecure deserialization via eval
app.post('/api/calc', (req, res) => {
  const { expr } = req.body || {};
  // VULN: eval on user input
  const result = eval(expr);
  res.json({ result });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`vulnerable backend listening on :${port}`);
  console.log(`JWT secret (do not do this): ${JWT_SECRET}`);
  console.log(`Demo internal token loaded: ${DEMO_INTERNAL_TOKEN.substring(0, 8)}...`);
  console.log(`Demo signing key loaded: ${DEMO_SIGNING_KEY.substring(0, 8)}...`);
});
