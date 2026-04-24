---
name: scan-repository
description: Scan this repository using deterministic GHE controls (CodeQL, Dependabot, secret scanning) plus MCP advisory / guidance servers, and produce a structured security report under reports/. Use when the user asks to run a security scan, produce a security report, or audit the repo for vulnerabilities.
---

# Scan repository and generate report

You are acting as the **security orchestrator**. Produce a full scan report
for the current repository.

## Steps

1. **Inventory** the repo (languages, package managers, Dockerfiles, IaC).
2. **Pull existing GHE alerts** via the `github` MCP server:
   - Code scanning (CodeQL) alerts
   - Dependabot alerts
   - Secret scanning alerts
3. **Run fresh dependency checks** via the terminal (`npm audit --json` in each
   workspace with a `package.json`).
4. **Enrich** each dependency finding with the `github-advisories` MCP server
   (GHSA / CVE details) and with `microsoft-learn` / `owasp-cheatsheets` for
   remediation guidance.
5. **Cluster & deduplicate** findings; same root cause = one entry.
6. **Emit** the report to `reports/security-scan-<YYYYMMDD-HHMM>.md` using the
   template below.

## Report template

```markdown
# Security scan report — <repo> — <timestamp>

## Summary
- Critical: N   High: N   Medium: N   Low: N
- Sources: CodeQL | Dependabot | SecretScanning | npm-audit

## Findings

### F-001 · <short title>
- Severity: <critical|high|medium|low>
- Source(s): <tool(s)>
- Location(s): <file:line or package@version>
- CWE / CVE / GHSA: <only if returned by an MCP tool>
- Description:
- Suggested remediation:
- Reference: <URL, only if returned by an MCP server>
- Reproduces on HEAD? yes / no (deterministically verified)
```

## Hard rules

- Every finding must carry at least one deterministic source.
- Never fabricate CVE IDs, CWE IDs, GHSA IDs, or URLs.
- Do not open issues from this skill — that is the job of the
  `create-vulnerability-issues` skill.
