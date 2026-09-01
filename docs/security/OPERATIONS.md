# Security Operations Guide

## Safety Boundary

This repository is an intentionally vulnerable training environment. Never deploy the
applications, use production credentials, or merge a validation drill into `main`.
Treat findings in `frontend/` and `backend/` as teaching artifacts unless a change adds
an undocumented vulnerability, weakens containment, or affects the security tooling.

## Report And Triage

1. Send suspected real vulnerabilities through [private vulnerability reporting](https://github.com/melabadi/security-showcase/security/advisories/new), not a public issue.
2. For an exposed or potentially active credential, revoke or rotate it immediately and investigate use before normal backlog triage.
3. Record the scanner, rule or advisory ID, affected revision, source and sink or package path, reachability, attacker prerequisites, realistic impact, and safe reproduction evidence.
4. Assign an accountable owner and remediation target. Do not dismiss a finding merely to reduce the alert count.
5. Verify a fix with the original deterministic scanner and the focused regression check. Confirm that intended demo behavior and containment remain intact.

Do not invent CWE, CVE, GHSA, or advisory URLs. Cite identifiers only when a
deterministic scanner or advisory source returned them.

## Response Targets

| Finding | Triage target | Remediation target |
|---|---:|---:|
| Potentially active secret | Immediate | Revoke or rotate immediately; investigate use |
| Critical exploitable tooling issue | 1 business day | 7 days |
| High tooling issue | 3 business days | 30 days |
| Moderate tooling issue | 10 business days | 90 days |
| Low tooling issue | Planned review | Risk-based backlog |

## Pull Requests

- Use a scoped issue or change record with acceptance criteria.
- Run `npm ci --ignore-scripts`, `npm run lint`, `npm ci --prefix frontend`,
  `npm ci --prefix backend`, `node --check backend/server.js`, and
  `npm run build --prefix frontend`.
- Require `Quality Gate / Validate`, `Code Quality / Lint`,
  `CodeQL / Analyze (javascript-typescript)`, and `Dependency Review / Dependency Review`
  after those checks have succeeded on the repository and are activated in the
  `main` ruleset.
- Require review by a person other than the author. An agent, bot, or the author cannot
  be the only approver.
- Explain any added, changed, or removed teaching vulnerability in the pull request.

## Dependencies

- Treat Dependabot pull requests as untrusted changes and review release notes, package
  ownership, install scripts, package names, and compatibility.
- Do not merge unrelated major runtime upgrades as one change.
- Development dependencies remain in scope because they execute in CI.
- The existing vulnerable dependency baseline is intentional. New high or critical
  vulnerable dependencies must be blocked by Dependency Review.
- An SBOM is an inventory, not proof of security, licensing, or integrity.

## AI-Assisted Changes

- Keep prompts free of real credentials, personal data, and restricted data.
- Preserve the tool, agent, and session provenance available for the change.
- Verify generated package names and versions against the approved registry.
- Review public-code matches and licensing before acceptance.
- Run normal deterministic checks and obtain independent human review. AI review and
  Copilot Autofix are proposals, not approval or proof.
- Review every MCP server, model, action, and GitHub App for permissions, data egress,
  retention, subprocessors, update path, and offboarding before use.

## Exceptions And Bypass

Complete [.github/SECURITY_EXCEPTION.md](../../.github/SECURITY_EXCEPTION.md) in a
private tracking system. The record needs technical evidence, a compensating control,
an accountable owner, an independent approver, a remediation plan, and an expiry date.

Do not use a push-protection or ruleset bypass as routine workflow. Record the reason,
review the audit event, and create expiring follow-up work after any emergency bypass.

## Safe Drills

Run negative tests only on disposable `lab/security-*` branches. Use synthetic secrets
and inert fixtures, predict the expected control first, preserve non-sensitive evidence,
then remove the test material instead of bypassing. Never merge or deploy a drill.

Review failed scans, stale alerts, access, apps, actions, runners, models, MCP servers,
and expiring exceptions at least quarterly.