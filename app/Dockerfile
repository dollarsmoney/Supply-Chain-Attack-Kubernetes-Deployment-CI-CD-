# ⚠️ INTENTIONALLY VULNERABLE — EDUCATION ONLY. Fixes: ../docs/REMEDIATION.md

# VULN-09: unpinned base image
FROM node:latest

WORKDIR /app
COPY app/package.json ./

# VULN-10: runs dependency lifecycle scripts
RUN npm install

COPY app/src ./src

# VULN-11: baked-in secrets in image layers (placeholders)
ENV API_KEY=sk_live_EXAMPLE_PLACEHOLDER_do_not_use_0000000000
ENV AWS_SECRET_ACCESS_KEY=EXAMPLEplaceholderSecretKeyDoNotUse00000000

EXPOSE 3000

# VULN-12: no USER — runs as root
CMD ["node", "src/server.js"]
