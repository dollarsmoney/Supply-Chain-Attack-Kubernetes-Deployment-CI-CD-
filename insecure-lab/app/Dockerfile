# ⚠️ INTENTIONALLY VULNERABLE — EDUCATION ONLY. Fixes: ../docs/REMEDIATION.md
FROM node:latest                 # VULN-09: unpinned base image
WORKDIR /app
COPY app/package.json ./
RUN npm install                  # VULN-10: runs dependency lifecycle scripts
COPY app/src ./src
ENV API_KEY=sk_live_EXAMPLE_PLACEHOLDER_do_not_use_0000000000   # VULN-11: baked-in secret
ENV AWS_SECRET_ACCESS_KEY=EXAMPLEplaceholderSecretKeyDoNotUse00000000
EXPOSE 3000
# VULN-12: no USER — runs as root
CMD ["node", "src/server.js"]
