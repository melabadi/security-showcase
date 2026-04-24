# Security & demo checklist

This repository is **intentionally vulnerable** and exists solely to power
the GHCP + GHE Security Architecture presentation. Treat every file as
untrusted.

## Pre-demo checklist (run once)

In **Settings → Code security and analysis**, confirm:

- [ ] **CodeQL analysis** — enabled (default setup disabled, advanced via `.github/workflows/codeql.yml`)
- [ ] **Dependency graph** — enabled
- [ ] **Dependabot alerts** — enabled
- [ ] **Dependabot security updates** — enabled
- [ ] **Secret scanning** — enabled
- [ ] **Push protection** — enabled
- [ ] **Validity checks** — enabled
- [ ] **Non-provider patterns** — enabled
- [ ] Custom secret-scanning patterns from `.github/secret_scanning.yml` registered in the org / repo UI

In **Settings → Branches → main**, confirm branch protection:

- [ ] Require pull request reviews
- [ ] Require status checks (`CodeQL`, `Security scan + report (agentic)`, `Dependency Review`)
- [ ] Require signed commits
- [ ] Block force pushes

## During the demo

1. **Probabilistic half** — open the `Security Orchestrator` chatmode, ask it
   to scan the repo. It will plan, call the six MCPs in
   [.vscode/mcp.json](.vscode/mcp.json), and produce a clustered report.
2. **Deterministic half** — run the `Security scan + report (agentic)`
   workflow from the Actions tab; watch SARIF land in the Security tab.
3. **Issues filing** — run `Security issues from findings (agentic)`;
   watch issues appear with the `security`, `auto-triage` labels.
4. **GHE built-ins** — walk through CodeQL alert → Dependabot PR →
   Secret Scanning alert → Push Protection block (slide 14).

## Reporting a real vulnerability in the tooling around this repo

If you find a vulnerability in the *tooling* (workflows, scripts, agent
prompts) rather than in the intentional demo code, email
`security@contoso.example` or open a private security advisory.
