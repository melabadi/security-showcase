---
on:
  workflow_dispatch:
  workflow_run:
    workflows: [ "Security scan + report" ]
    types: [ completed ]
    branches: [ main ]

permissions:
  contents: read
  security-events: read
  issues: read
  pull-requests: read
  actions: read

engine: copilot

network: defaults

tools:
  github:
    toolsets: [default, code_security, dependabot, secret_protection, security_advisories]
  bash:
    - "ls"
    - "cat *"
    - "find *"
    - "grep *"
    - "gh run list *"
    - "gh run download *"

safe-outputs:
  create-issue:
    max: 15
    title-prefix: "[security] "
    labels: [security, auto-triage]
  add-comment:
    max: 5
---

# Agentic workflow #2 — Security issues from findings

You are the **security orchestrator** (slide 8 of the GHCP + GHE Security deck).
This run turns the latest scan report produced by the `Security scan + report`
workflow into GitHub issues — one per finding cluster.

## Inputs

- The latest successful run of the `Security scan + report` workflow has
  uploaded a markdown report as a workflow asset. Locate and download it using
  the bash tool and the `gh` CLI:
  ```
  gh run list --workflow=security-scan-report.lock.yml --status success --limit 1
  gh run download <run-id> --name safe_output_assets
  ```
  Then read the markdown file under the downloaded directory.
- You may also confirm findings directly against the `github` code-security
  toolset (code scanning, Dependabot, secret scanning alerts).

## Steps

1. **Load the most recent scan report.** If none is available, stop and
   explain why — do not fabricate findings.
2. **For each finding cluster in the report:**
   1. Build a stable fingerprint from `(tool, rule-id)` so re-runs don't
      create duplicates.
   2. Use the `github` toolset to search for an existing open issue whose
      body contains the marker `<!-- security-fingerprint:<fp> -->`. If one
      exists, add a comment with today's re-detection evidence instead of
      opening a duplicate.
   3. Otherwise create a new issue with:
      - Title starts with `[security] ` (the title-prefix is added automatically).
      - Body includes:
        - The fingerprint marker as an HTML comment on line 1.
        - Source tool(s), rule id, severity.
        - Affected files / packages.
        - Deterministic reproduction steps (command + expected output).
        - A proposed patch (code block).
        - Link back to the scan report asset.
        - Microsoft Learn or OWASP Cheat Sheet reference when relevant (cite
          only URLs that the MCP servers returned — never invent).
      - Labels: `security`, `auto-triage`, plus `severity:<critical|high|medium|low>`
        and `source:<codeql|dependabot|secret-scanning|semgrep|npm-audit|trivy>`.
3. **Summarise** at the end: how many issues created, how many deduplicated,
   how many skipped for missing deterministic source.

## Hard rules

- Never close or merge anything.
- Never open more than one issue per cluster per run.
- Never invent CVE / CWE IDs, advisory URLs, or Microsoft Learn links.
- Every issue must cite at least one deterministic source (CodeQL / Dependabot
  / Secret Scanning / Semgrep / Trivy / npm-audit).
