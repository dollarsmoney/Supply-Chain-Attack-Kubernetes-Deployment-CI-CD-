// ⚠️ INTENTIONALLY VULNERABLE — EDUCATION ONLY. Sinks are local; no network callback.
// Fixes: ../../docs/REMEDIATION.md
import express from 'express';
import { execSync } from 'node:child_process';

const app = express();
app.use(express.json());

// VULN-13: hardcoded credentials (placeholders)
const DB_PASSWORD = 'P@ssw0rd-EXAMPLE-do-not-use';
const GITHUB_TOKEN = 'ghp_EXAMPLEplaceholderTokenDoNotUse000000000000';

app.get('/ping', (req, res) => {
  const host = req.query.host || 'localhost';
  const out = execSync(`echo pinging ${host}`).toString();   // VULN-14: command injection
  res.type('text/plain').send(out);
});

app.get('/greet', (req, res) => {
  const name = req.query.name || 'guest';
  res.type('html').send(`<h1>Hello, ${name}</h1>`);           // VULN-15: reflected XSS
});

app.get('/healthz', (_req, res) => res.json({ ok: true }));   // VULN-16: no security headers set anywhere

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}; db pw=${DB_PASSWORD}; token=${GITHUB_TOKEN}`);  // VULN-17: secrets in logs
});
