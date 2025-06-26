DevSecOps Security Tooling Documentation
This document outlines the security tools integrated into the CI/CD pipeline for the Node.js project. These tools ensure automated detection of vulnerabilities, insecure code patterns, secrets exposure, and image-level risks, aligning with industry best practices for secure software delivery.

📌 Security Tools Used
Tool	Purpose	Type
Semgrep	Static Application Security Testing (SAST) & Code Linting	Code & Security Scanner
ESLint	Code quality and style enforcement	Code Linter
Gitleaks	Secrets detection in Git history or changes	Secrets Scanner
Snyk	Dependency and container vulnerability scanning	Software Composition Analysis (SCA) + Container Security

🔧 Tool Configuration Details
1. Semgrep
Used For: SAST and advanced code linting

How it's configured:

Run via Docker in GitHub Actions

Config: Semgrep default JavaScript rules

Output format: JSON and optionally SARIF

Why Semgrep:

Language-aware scanning for JS/TS

Detects insecure coding practices, logic flaws, and linting issues

Open-source and customizable

bash
Copy
Edit
semgrep scan --config p/javascript --json --output semgrep.json
2. ESLint
Used For: Code style enforcement and basic code linting

How it's configured:

Uses ESLint v9+ with eslint.config.js

Run via Docker in GitHub Actions

Output format: SARIF for GitHub Security Dashboard (optional)

Why ESLint:

Widely adopted linter for JavaScript/Node.js

Helps enforce consistent code style and catch common issues early

js
Copy
Edit
// eslint.config.js
export default [
  {
    files: ["**/*.js"],
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"]
    }
  }
];
3. Gitleaks
Used For: Secrets scanning in code, commits, and Git history

How it's configured:

Run in GitHub Actions via Docker

Target: full repository or recent commit range

Output: JSON or console output

Why Gitleaks:

Detects hardcoded secrets (API keys, tokens, credentials)

Lightweight, fast, and Git-aware

bash
Copy
Edit
gitleaks detect --source=. --report-format=json --report-path=gitleaks-report.json
4. Snyk
Used For:

Dependency vulnerability scanning (npm)

Docker image scanning for OS and library CVEs

How it's configured:

Requires a SNYK_TOKEN stored in GitHub Secrets

Run in GitHub Actions via official Snyk actions

Output: JSON reports uploaded as artifacts

Why Snyk:

Developer-friendly CVE detection

Actively maintained vulnerability database

Can monitor live projects post-deployment via GitHub App

bash
Copy
Edit
# Dependency scan
snyk test --all-projects --json-file-output=snyk-deps.json

# Image scan
snyk container test myapp:latest --json-file-output=snyk-image.json
✅ Summary of Benefits
Security Area	Tool	Benefit
Static Code Analysis	Semgrep	Detects vulnerable code patterns and logic flaws
Code Quality	ESLint	Enforces coding standards and prevents bugs
Secrets Management	Gitleaks	Prevents secret leakage into Git history
Dependency Security	Snyk	Finds vulnerabilities in 3rd-party libraries
Container Hardening	Snyk	Identifies OS-level vulnerabilities in Docker images

📁 Artifacts & Reporting
Each scan stores its results as artifacts within the GitHub Actions run for visibility and traceability:

Tool	Artifact Name	Format
Semgrep	semgrep.json	JSON
ESLint	eslint-report.sarif	SARIF
Gitleaks	gitleaks-report.json	JSON
Snyk	snyk-deps.json / snyk-image.json	JSON

These can be optionally integrated into:

GitHub Security Dashboard (via SARIF upload)

Slack/Email notifications

Security Gate reports

🔄 CI/CD Integration Flow
mermaid
Copy
Edit
graph TD
A[Checkout Code] --> B[ESLint Linting]
B --> C[Gitleaks Secrets Scan]
C --> D[Semgrep SAST]
D --> E[Snyk Dependency Scan]
E --> F[Docker Build]
F --> G[Snyk Image Scan]
G --> H[Upload Reports as Artifacts]
🚀 Future Enhancements
Upload Semgrep/ESLint SARIF to GitHub Code Scanning dashboard

Integrate Slack or email notifications for high severity findings

Use Scorecard for overall repo security posture

Add Trivy as a complementary image scanner