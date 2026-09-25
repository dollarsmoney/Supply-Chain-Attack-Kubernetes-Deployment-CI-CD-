# Supply-Chain Security Lab

> ⚠️ **INTENTIONALLY VULNERABLE — FOR EDUCATION ONLY — DO NOT DEPLOY.**
> This repository contains deliberate, documented security weaknesses. It exists to be
> **read and scanned**, not run in production. Nothing here exfiltrates data, calls out to a
> network, or contains a working backdoor — every weakness is demonstrative and paired with a fix.

A hands-on lab for learning **CI/CD, dependency, container, and Kubernetes supply-chain security** —
modelled on OWASP WebGoat / DVWA but aimed at the software supply chain. It plants **27 documented
weaknesses**, then ships the **SAST + SCA + SBOM + DAST** pipeline that detects them, so you can see a
finding and its remediation side by side.

## Contents

| Path | What it demonstrates |
|------|----------------------|
| [`app/`](app) | Outdated CVE dependencies, dependency-confusion risk, root container, baked-in secret, command injection, XSS |
| [`helm/vulnerable-shop/`](helm/vulnerable-shop) | Privileged pod, `hostPath /`, plaintext secrets, no resource limits |
| [`ci-cd/insecure-ci.yml`](ci-cd/insecure-ci.yml) | Script injection, `pull_request_target`, unpinned actions, `write-all`, secret-in-logs, `curl \| bash` |
| [`ci-cd/scan.yml`](ci-cd/scan.yml) | The **defense**: SAST + SCA + SBOM + DAST that flag every weakness |
| [`docs/VULNERABILITIES.md`](docs/VULNERABILITIES.md) | Index of all 27 findings → file, CWE, detecting tool |
| [`docs/REMEDIATION.md`](docs/REMEDIATION.md) | The corrected pattern for each finding |

## Quick start

```bash
# SAST
semgrep scan --config p/javascript --config p/secrets app
gitleaks detect --source .
checkov -d helm --framework helm
trivy config .

# SCA
cd app && npm install --package-lock-only --ignore-scripts && npm audit

# SBOM
syft app -o cyclonedx-json=sbom.cdx.json && grype sbom:sbom.cdx.json

# DAST — build, run, then ZAP baseline (see ci-cd/scan.yml)
```

## A note on the workflows

The CI/CD workflows live in [`ci-cd/`](ci-cd) — **not** under `.github/workflows/` — so GitHub
Actions does **not** run them. They are here to be read and scanned as part of the lesson.

- **`scan.yml`** — the defense (SAST + SCA + SBOM + DAST). To actually run it, copy it into a
  `.github/workflows/` directory and trigger it manually (`workflow_dispatch`).
- **`insecure-ci.yml`** — the vulnerable demo. Its `pull_request_target` trigger (VULN-02) makes it
  live-exploitable **if** placed in `.github/workflows/` on a public repo, so it is intentionally
  kept out of that path. Read it; don't activate it.
