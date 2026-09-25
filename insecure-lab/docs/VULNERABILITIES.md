# Vulnerability Index

> ⚠️ Intentional, documented weaknesses for education. Each maps to a file, a CWE, and the
> discipline/tool that detects it. Fixes are in [REMEDIATION.md](REMEDIATION.md).

## CI/CD pipeline — `.github/workflows/insecure-ci.yml`

| ID | Weakness | CWE | Detected by |
|----|----------|-----|-------------|
| VULN-01 | Script injection via untrusted PR title into `run:` | CWE-94 | SAST (actionlint / Semgrep) |
| VULN-02 | `pull_request_target` + checkout of PR head (pwn-request) | CWE-829 | SAST / review |
| VULN-03 | Third-party action pinned to moving tag, not SHA | CWE-829 | SAST / review |
| VULN-04 | Workflow-wide `permissions: write-all` | CWE-250 | SAST / review |
| VULN-05 | Secret echoed to build log | CWE-532 | SAST / secret scan |
| VULN-06 | `curl \| bash` of unverified installer | CWE-494 | SAST / review |

## Dependencies & container — `app/`

| ID | Weakness | CWE | Detected by |
|----|----------|-----|-------------|
| VULN-07 | Dependency-confusion risk: unscoped internal name, no `.npmrc` | CWE-427 | SCA / review |
| VULN-08 | Pinned known-vulnerable dependencies | CWE-1104 / CWE-937 | SCA (npm audit, Trivy, Grype) |
| VULN-09 | Unpinned floating base image (`node:latest`) | CWE-1104 | Container scan (Trivy, Hadolint) |
| VULN-10 | `npm install` runs dependency lifecycle scripts | CWE-829 | Review / SCA |
| VULN-11 | Secret baked into image `ENV` layer | CWE-798 / CWE-532 | Container scan / secret scan |
| VULN-12 | Container runs as root (no `USER`) | CWE-250 | Container scan (Trivy, Hadolint) |

## Application code — `app/src/server.js`

| ID | Weakness | CWE | Detected by |
|----|----------|-----|-------------|
| VULN-13 | Hardcoded credentials in source | CWE-798 | SAST (Gitleaks, Semgrep p/secrets) |
| VULN-14 | OS command injection (input → shell) | CWE-78 | SAST + DAST |
| VULN-15 | Reflected XSS (input → HTML) | CWE-79 | SAST + DAST |
| VULN-16 | Missing security response headers | CWE-693 | DAST (OWASP ZAP) |
| VULN-17 | Secrets written to application logs | CWE-532 | SAST / secret scan |

## Kubernetes / Helm — `helm/vulnerable-shop/`

| ID | Weakness | CWE | Detected by |
|----|----------|-----|-------------|
| VULN-18 | `:latest` tag + `Always` pull, no digest | CWE-1104 | IaC (Checkov, Trivy config) |
| VULN-19 | Plaintext secrets in `values.yaml` | CWE-798 / CWE-312 | IaC / secret scan |
| VULN-20 | `hostNetwork: true` | CWE-668 | IaC (Checkov, kube-bench) |
| VULN-21 | `hostPID: true` | CWE-250 | IaC (Checkov, kube-bench) |
| VULN-22 | Plaintext secret as env var | CWE-312 | IaC |
| VULN-23 | Privileged / runAsRoot / privesc / added caps | CWE-250 / CWE-269 | IaC (Checkov, Trivy config) |
| VULN-24 | No resource requests/limits | CWE-400 | IaC |
| VULN-25 | `hostPath` mount of `/` (node takeover) | CWE-22 / CWE-732 | IaC (Checkov, Trivy config) |
| VULN-26 | Auto-mounted ServiceAccount token | CWE-250 | IaC (Checkov) |
| VULN-27 | Secret rendered inline in template | CWE-312 / CWE-798 | IaC / secret scan |
