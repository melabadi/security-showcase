---
on:
  workflow_dispatch:
  schedule: daily
  push:
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
    - "node *"
    - "npm *"
    - "npx *"
    - "cp *"
    - "mkdir *"

safe-outputs:
  upload-asset:
    max: 5
    allowed-exts: [".md", ".json", ".sarif", ".txt"]
    max-size: 10240
  add-comment:
    max: 1
---

# Agentic workflow #1 — Security scan + report

You are the **security orchestrator** from the GHCP + GHE Security Architecture deck
(slide 8). Your job on this run is to produce a structured security report for this
repository and publish it as a workflow artifact.

## Context

- This repository is **intentionally vulnerable** for security demos — see
  `.github/copilot-instructions.md`.
- The deterministic GHE tools (CodeQL, Dependabot, Secret Scanning, Dependency
  Review) already run in their own workflows. You must **read** their findings
  via the `github` MCP toolsets, not re-run them.
- Additional deterministic scanners (Semgrep, Trivy, npm audit) can be invoked
  through the bash tool when helpful.

## Steps

1. **Inventory the repository.** Enumerate the top-level folders and identify
   the languages / package managers used (expect `frontend/` React+Vite and
   `backend/` Node/Express).
2. **Pull existing GHE alerts** via the `github` code-security toolset:
   - Code scanning alerts (CodeQL)
   - Dependabot alerts
   - Secret scanning alerts
3. **Run fresh deterministic scans** with bash if the GHE tooling has not
   already covered something:
   - `npm audit --json` in `frontend/` and `backend/`.
   - Any other deterministic tool available in the runner (best-effort; do not
     fail the run if a scanner isn't present).
4. **Cluster & deduplicate** findings by root cause. Same CVE across multiple
   lockfiles = one cluster.
5. **Draft the report** as a single markdown file `reports/security-scan-<ISO-timestamp>.md`
   using this structure:

   ```markdown
   # Security scan report — <repo> — <timestamp>

   ## Summary
   - Critical: N · High: N · Medium: N · Low: N
   - Sources: CodeQL | Dependabot | SecretScanning | npm-audit | ...

   ## Findings

   ### F-001 · <short title>
   - Severity: <critical|high|medium|low>
   - Source(s): <tool(s)>
   - Location(s): <file:line or package@version>
   - CWE / CVE: <only if returned by a deterministic source>
   - Description:
   - Suggested remediation:
   - Reproduces on HEAD? yes / no
   ```

6. **Upload** that markdown file as an asset so the second agentic workflow
   (`security-issues-from-findings`) can consume it.
7. **Add a short summary comment** on the most recent open pull request (if any)
   linking to the artifact. If there is no open PR, skip this step silently.

## Hard rules

- **Every finding must carry at least one deterministic source.** If you can't
  attach one, drop the finding.
- **Never fabricate CVE / CWE IDs or advisory URLs.**
- **Never weaken** CodeQL, Dependabot, Secret Scanning, Push Protection, or
  branch protection.
- **Never file issues from this workflow** — that is workflow #2's job.
- **Never commit real secrets.** Only the repo's canonical placeholder patterns
  (`DEMO_...`, `SIGN-...`).
---
# Trigger - when should this workflow run?
on:
  workflow_dispatch:  # Manual trigger

# Alternative triggers (uncomment to use):
# on:
#   issues:
#     types: [opened, reopened]
#   pull_request:
#     types: [opened, synchronize]
#   schedule: daily  # Fuzzy daily schedule (scattered execution time)
#   # schedule: weekly on monday  # Fuzzy weekly schedule

# Permissions - what can this workflow access?
# Write operations (creating issues, PRs, comments, etc.) are handled
# automatically by the safe-outputs job with its own scoped permissions.
permissions:
  contents: read
  issues: read
  pull-requests: read

# AI engine to use for this workflow
engine: copilot

# Tools - GitHub API access via toolsets (context, repos, issues, pull_requests)
# tools:
#   github:
#     toolsets: [default]

# Network access
network: defaults

# Outputs - what APIs and tools can the AI use?
safe-outputs:
  create-issue:          # Creates issues (default max: 1)
    max: 5               # Optional: specify maximum number
  # actions:
  # activation-comments:
  # add-comment:
  # add-labels:
  # add-reviewer:
  # allowed-github-references:
  # assign-milestone:
  # assign-to-agent:
  # assign-to-user:
  # autofix-code-scanning-alert:
  # call-workflow:
  # close-discussion:
  # close-issue:
  # close-pull-request:
  # concurrency-group:
  # create-agent-session:
  # create-agent-task:
  # create-code-scanning-alert:
  # create-discussion:
  # create-project:
  # create-project-status-update:
  # create-pull-request:
  # create-pull-request-review-comment:
  # dispatch-workflow:
  # dispatch_repository:
  # environment:
  # failure-issue-repo:
  # footer:
  # group-reports:
  # hide-comment:
  # id-token:
  # link-sub-issue:
  # mark-pull-request-as-ready-for-review:
  # max-bot-mentions:
  # mentions:
  # missing-data:
  # missing-tool:
  # noop:
  # push-to-pull-request-branch:
  # remove-labels:
  # reply-to-pull-request-review-comment:
  # report-failure-as-issue:
  # report-incomplete:
  # resolve-pull-request-review-thread:
  # scripts:
  # set-issue-type:
  # steps:
  # submit-pull-request-review:
  # threat-detection:
  # unassign-from-user:
  # update-discussion:
  # update-issue:
  # update-project:
  # update-pull-request:
  # update-release:
  # upload-artifact:
  # upload-asset:

---

# security-scan-report

Describe what you want the AI to do when this workflow runs.

## Instructions

Replace this section with specific instructions for the AI. For example:

1. Read the issue description and comments
2. Analyze the request and gather relevant information
3. Provide a helpful response or take appropriate action

Be clear and specific about what the AI should accomplish.

## Notes

- Run `gh aw compile` to generate the GitHub Actions workflow
- See https://github.github.com/gh-aw/ for complete configuration options and tools documentation
