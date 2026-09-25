# ⚠️ Insecure Lab — Supply-Chain Security Teaching Environment

> **INTENTIONALLY VULNERABLE — FOR EDUCATION ONLY — DO NOT DEPLOY, DO NOT RUN IN CI.**
> Every file in this folder contains deliberate, documented weaknesses. It exists to be
> **read and scanned**, not run in production. Nothing here exfiltrates data, calls out to
> a network, or contains a working backdoor — the weaknesses are demonstrative and paired
> with fixes.

## What this is

This is the *"before"* half of a supply-chain security exercise, modelled on OWASP WebGoat /
DVWA but aimed at **CI/CD, dependencies, containers, and Kubernetes**. The main repo already
ships a **secure** backend pipeline (`../ecommerce/backend/.github/workflows/ci.yaml`) that runs
Gitleaks, Semgrep, `npm audit`, SBOM + Trivy, and OWASP ZAP. This lab is the vulnerable target
those exact tools are meant to catch — so you can see a finding, then see the fix.

## Why it's safe to keep in the repo

- The demo pipeline lives at `insecure-lab/.github/workflows/`, **not** the repo-root
  `.github/workflows/`, so GitHub Actions **does not auto-run it**.
- All secrets are obvious placeholders (`EXAMPLE`, `do-not-use`).
- The one command-injection sink runs `echo` locally; the XSS sink reflects into a local
  response. There is **no** network callback, exfiltration endpoint, or published package.

## Layout

| Path | What it demonstrates |
|------|----------------------|
| `app/package.json` | Outdated CVE dependencies (SCA) + dependency-confusion risk |
| `app/Dockerfile` | Unpinned base, root user, baked-in secret (container scanning) |
| `app/src/server.js` | Hardcoded secrets, command injection, XSS, missing headers (SAST/DAST) |
| `helm/vulnerable-shop/` | Privileged pod, hostPath `/`, plaintext secrets, no limits (IaC) |
| `.github/workflows/insecure-ci.yml` | Script injection, `pull_request_target`, unpinned actions, `write-all`, secret-in-logs, `curl\|bash` |
| `.github/workflows/scan.yml` | The **defense**: SAST + SCA + SBOM + DAST that flag it all |
| `docs/VULNERABILITIES.md` | Index of every `VULN-##` → file, CWE, detecting tool |
| `docs/REMEDIATION.md` | The corrected pattern for each finding |

## The four disciplines (run locally)

```bash
# SAST — static analysis of code + IaC
semgrep scan --config p/javascript --config p/secrets insecure-lab/app
gitleaks detect --source insecure-lab
checkov -d insecure-lab/helm --framework helm
trivy config insecure-lab/

# SCA — dependency vulnerabilities
cd insecure-lab/app && npm install --package-lock-only --ignore-scripts && npm audit

# SBOM — bill of materials, then scan it
syft insecure-lab/app -o cyclonedx-json=sbom.cdx.json
grype sbom:sbom.cdx.json

# DAST — dynamic scan of the running app (build + run + ZAP baseline)
#   see .github/workflows/scan.yml → dast job
```

## How to use it

1. Read `docs/VULNERABILITIES.md` to see the planted weaknesses.
2. Run the scanners above and match findings to `VULN-##` IDs.
3. Read `docs/REMEDIATION.md` and compare against how the **real** `../ecommerce` app,
   `../ecommerce/helm/shop` chart, and secure backend CI do it correctly.
