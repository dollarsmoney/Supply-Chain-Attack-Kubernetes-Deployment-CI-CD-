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

Everything lives under [`insecure-lab/`](insecure-lab/):

| Path | What it demonstrates |
|------|----------------------|
| [`app/`](insecure-lab/app) | Outdated CVE dependencies, dependency-confusion risk, root container, baked-in secret, command injection, XSS |
| [`helm/vulnerable-shop/`](insecure-lab/helm/vulnerable-shop) | Privileged pod, `hostPath /`, plaintext secrets, no resource limits |
| [`.github/workflows/insecure-ci.yml`](insecure-lab/.github/workflows/insecure-ci.yml) | Script injection, `pull_request_target`, unpinned actions, `write-all`, secret-in-logs, `curl \| bash` |
| [`.github/workflows/scan.yml`](insecure-lab/.github/workflows/scan.yml) | The **defense**: SAST + SCA + SBOM + DAST that flag every weakness |
| [`docs/VULNERABILITIES.md`](insecure-lab/docs/VULNERABILITIES.md) | Index of all 27 findings → file, CWE, detecting tool |
| [`docs/REMEDIATION.md`](insecure-lab/docs/REMEDIATION.md) | The corrected pattern for each finding |

## Quick start

```bash
# SAST
semgrep scan --config p/javascript --config p/secrets insecure-lab/app
gitleaks detect --source insecure-lab
checkov -d insecure-lab/helm --framework helm
trivy config insecure-lab/

# SCA
cd insecure-lab/app && npm install --package-lock-only --ignore-scripts && npm audit

# SBOM
syft insecure-lab/app -o cyclonedx-json=sbom.cdx.json && grype sbom:sbom.cdx.json

# DAST — build, run, then ZAP baseline (see insecure-lab/.github/workflows/scan.yml)
```

> **Note:** the workflow files live under `insecure-lab/.github/workflows/` (not the repo root),
> so GitHub Actions does **not** auto-run them. To demo the scanners, copy `scan.yml` to a
> root `.github/workflows/` directory and trigger it manually.

See [`insecure-lab/README.md`](insecure-lab/README.md) for full details.
