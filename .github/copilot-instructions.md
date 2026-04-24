---
applyTo: "**"
---

# Repository-wide security instructions

This repository is **intentionally vulnerable** for GHCP + GHE security
demos. When generating or reviewing code here:

## Do
- Point out vulnerabilities rather than silently "fixing" them — each bug is a teaching artefact and may be referenced by the presentation.
- Prefer deterministic tooling (CodeQL queries, Semgrep rules, Dependabot, Trivy, Snyk) when answering "is this vulnerable?".
- When you need authoritative security guidance, call the `microsoft-learn` MCP server.
- When you need live alert data, call the `github` MCP server — don't guess.
- Keep any example secrets in the canonical fake forms (`AKIAIOSFODNN7EXAMPLE`, `ghp_0...EXAMPLE`, `sk_live_5100...`). They must still match scanner patterns but not be valid.

## Don't
- Don't deploy anything in `frontend/` or `backend/` to a real environment.
- Don't remove the vulnerable samples without an explicit instruction.
- Don't weaken branch protection, CodeQL, Dependabot, secret scanning, or push protection settings.
- Don't invent CVE IDs or advisory URLs. Only cite IDs returned by an MCP server.

## Security tool map (what lives where)

| Concern             | Deterministic owner                                           |
| ------------------- | ------------------------------------------------------------- |
| Code vulns (SAST)   | CodeQL (`.github/workflows/codeql.yml`), Semgrep MCP          |
| Deps / CVEs         | Dependabot (`.github/dependabot.yml`), Snyk MCP               |
| Container / IaC     | Trivy MCP                                                     |
| Leaked credentials  | GitHub secret scanning + push protection + custom patterns    |
| Cloud posture       | Azure MCP (Defender for Cloud, Azure Policy)                  |
| Official guidance   | Microsoft Learn MCP                                           |
| Orchestration       | `.github/chatmodes/security-orchestrator.chatmode.md`         |
| Triage              | `.github/chatmodes/vulnerability-triage.chatmode.md`          |
| Scan + report       | `.github/workflows/security-scan-report.yml`                  |
| Create issues       | `.github/workflows/security-issues-from-findings.yml`         |
