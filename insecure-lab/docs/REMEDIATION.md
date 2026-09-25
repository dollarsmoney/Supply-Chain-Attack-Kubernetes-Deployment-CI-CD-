# Remediation Guide

> How to fix each planted weakness. Where the real repo already does it right, the
> reference is called out — compare the two to internalize the pattern.

## CI/CD pipeline

- **VULN-01 Script injection** — never interpolate `${{ github.event.* }}` into `run:`.
  Pass through `env:` and reference the quoted shell var:
  ```yaml
  env:
    TITLE: ${{ github.event.pull_request.title }}
  run: echo "Building PR: $TITLE"
  ```
- **VULN-02 pwn-request** — use `pull_request` (not `pull_request_target`) for untrusted code,
  and never check out the PR head in a secret-bearing job. If you must, split into a privileged
  job that consumes only sanitized artifacts.
- **VULN-03 Unpinned actions** — pin to a full commit SHA: `some-org/some-action@<40-char-sha>`,
  and enable Dependabot for actions. The real backend CI pins official actions by major version;
  tighten third-party ones to SHAs.
- **VULN-04 write-all** — default `permissions: contents: read` at workflow level (as the real
  `ci.yaml` does) and grant the minimum extra scope per job.
- **VULN-05 / VULN-17 Secret in logs** — never `echo` secrets; rely on GitHub masking, and keep
  secrets in `env:` only for the step that needs them.
- **VULN-06 curl|bash** — download, verify a pinned checksum, then execute:
  ```bash
  curl -sSfL -o inst.sh URL && echo "<sha256>  inst.sh" | sha256sum -c && bash inst.sh
  ```
  The real backend CI installs Gitleaks by pinning an explicit version.

## Dependencies & container

- **VULN-07 Dependency confusion** — scope the package (`@yourorg/shop-utils`), pin the private
  registry in `.npmrc`, commit the lockfile, and install with `--ignore-scripts`.
- **VULN-08 Vulnerable deps** — bump to patched ranges and keep a committed `package-lock.json`;
  let SCA (npm audit / Trivy / Grype) gate merges. The real backend keeps deps current.
- **VULN-09 Unpinned base** — pin by digest: `FROM node:22-alpine@sha256:<digest>`.
- **VULN-10 Lifecycle scripts** — `npm ci --ignore-scripts` against the lockfile.
- **VULN-11 Baked-in secret** — inject at runtime from a secret store; never `ENV SECRET=`.
- **VULN-12 Root container** — add a non-root user and `USER node`. The real
  `ecommerce/backend/Dockerfile` already runs `USER node`.

## Application code

- **VULN-13 Hardcoded creds** — load from env / secret manager; add secret scanning to pre-commit.
- **VULN-14 Command injection** — use `execFile('echo', [host])` with an argument array and
  allow-list/validate input; never build a shell string.
- **VULN-15 XSS** — HTML-encode interpolated values and set a strict `Content-Security-Policy`.
- **VULN-16 Missing headers** — add `helmet()` (CSP, HSTS, X-Content-Type-Options, etc.).

## Kubernetes / Helm

- **VULN-18 :latest** — pin an immutable digest, `imagePullPolicy: IfNotPresent`. The real
  `helm/shop` chart avoids floating tags for app images.
- **VULN-19 / VULN-22 / VULN-27 Plaintext secrets** — source from Vault / External Secrets
  Operator. See the real chart's `templates/externalsecret.yaml`, `secretstore.yaml`, and the
  Vault-backed path in `helm/shop/values.yaml`.
- **VULN-20 hostNetwork / VULN-21 hostPID** — set both to `false`.
- **VULN-23 securityContext** — `runAsNonRoot: true`, `runAsUser: 1000`, `privileged: false`,
  `allowPrivilegeEscalation: false`, `readOnlyRootFilesystem: true`, `capabilities.drop: [ALL]`.
- **VULN-24 Resource limits** — set `resources.requests`/`limits`, as every workload in the real
  `helm/shop` chart does.
- **VULN-25 hostPath /** — remove it; use a scoped PVC (see `k8s/10-storage.yaml`).
- **VULN-26 SA token** — `automountServiceAccountToken: false` unless the API is needed.
