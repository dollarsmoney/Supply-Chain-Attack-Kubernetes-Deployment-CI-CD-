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
| [`.github/workflows/insecure-ci.yml`](.github/workflows/insecure-ci.yml) | Script injection, `pull_request_target`, unpinned actions, `write-all`, secret-in-logs, `curl \| bash` |
| [`.github/workflows/scan.yml`](.github/workflows/scan.yml) | The **defense**: SAST + SCA + SBOM + DAST that flag every weakness |
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

# DAST — build, run, then ZAP baseline (see .github/workflows/scan.yml)
```

## The workflows (these run)

Both workflows live in [`.github/workflows/`](.github/workflows) and execute on GitHub Actions:

- **`scan.yml`** — the defensive pipeline (SAST + SCA + SBOM + DAST). Runs on every push and
  pull request to `main`. Jobs are non-blocking, so one run surfaces the full set of findings
  and uploads reports (SARIF, SBOM, ZAP) as artifacts.
- **`insecure-ci.yml`** — a demo of insecure CI patterns, kept for study. The genuinely
  exploitable parts have been removed so it is safe to run on a public repo: it triggers only on
  manual dispatch (never `pull_request_target`) and checks out this repo's own code, never an
  untrusted PR head. The remaining anti-patterns are documented in
  [`docs/VULNERABILITIES.md`](docs/VULNERABILITIES.md).
