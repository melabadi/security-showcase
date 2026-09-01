# GitHub Security Baseline Rollout

Snapshot date: 2026-08-31

No control is described as enforced until a negative test proves that it blocks the
unsafe action.

## Verified Inventory

| Item | Verified value |
|---|---|
| Host and repository | GitHub.com, `melabadi/security-showcase` |
| Visibility and default branch | Public, `main` |
| Ownership | Personal repository; `@melabadi` is the only collaborator and administrator |
| Languages and frameworks | JavaScript/JSX, React/Vite frontend, Node/Express backend |
| Package manager | npm with lockfiles in `/frontend` and `/backend` |
| CI toolchain | Node.js 22.20.0 |
| CodeQL setup | Advanced workflow for `javascript-typescript`; default setup is not configured |
| Data classification | Public synthetic demo data; real credentials and personal data prohibited |
| Data residency | No repository-specific requirement recorded |
| Deployment | Not applicable; repository policy prohibits deployment |

The single-maintainer repository cannot provide independent approval. Add at least one
accountable reviewer before activating pull-request or code-owner enforcement.

## Reproducible Baseline

| Command | Result on 2026-08-31 |
|---|---|
| `npm ci --prefix frontend` | Pass; npm reported 11 known audit findings |
| `npm ci --prefix backend` | Pass; npm reported 22 known audit findings |
| `npm ci --ignore-scripts` | Pass; installs repository quality tooling with 0 known audit findings |
| `npm run lint` | Pass; ESLint reported 0 errors and 0 warnings |
| `node --check backend/server.js` | Pass |
| `npm run build --prefix frontend` | Pass |
| Unit/integration suite | Not configured |
| End-to-end gate | Not applicable to merge; local red-team journeys are isolated demo activity |

The dependency findings are expected teaching artifacts. They still require ownership
and must not be treated as a healthy production baseline.

## Repository Controls

| Control | Status | Evidence or next action |
|---|---|---|
| Private vulnerability reporting | Enabled by REST API | Negative intake drill pending |
| Dependency graph and Dependabot alerts | Enabled by REST API | 133 open alerts: 2 critical, 59 high, 61 medium, 11 low |
| Dependabot security updates | Enabled by REST API | Update PR behavior pending |
| Dependabot version updates | Configured | Two daily application npm entries, plus weekly root npm and Actions entries |
| CodeQL advanced setup | Configured | Last `main` run before this change succeeded; 13 open alerts: 3 critical, 9 high, 1 medium |
| CodeQL default setup | Disabled/not configured | Exactly one setup retained |
| Dependency Review | Configured | Previous `main` run failed; new pinned workflow must pass on this PR |
| Quality Gate | Configured on feature branch | Local equivalent passed; GitHub check pending |
| Code Quality lint gate | Configured on feature branch | Local `npm run lint` passed; `Code Quality / Lint` check pending |
| Secret scanning | Enabled | Negative synthetic-secret drill pending |
| Push protection | Enabled | Negative synthetic-secret drill pending |
| Validity checks | Disabled | No supported repository REST write field was available |
| Non-provider and AI detection | Disabled/unavailable | Versioned API writes were accepted but the settings remained disabled |
| Custom secret patterns | Documented only | Dry-run and publish the patterns in repository settings |
| Workflow token default | Read-only | Verified through Actions permissions API |
| Security automation labels | Provisioned | 14 security, severity, source, and dependency labels created |
| Action allow-list | Enforced, not negative-tested | GitHub-owned actions allowed; verified and other third-party actions denied |
| Immutable action pins | Enforced, not negative-tested | GitHub requires SHA pins; recheck generated lockfiles after every compile |
| Ruleset or branch protection | Not configured | Blocked by independent-review stop condition and pending check runs |
| Environments and OIDC deployment | Not applicable | Deployment is prohibited for this demo repository |
| Audit-log SIEM streaming | Not configured | Requires an approved enterprise destination and retention policy |

Secret-alert counts were not read because the current token lacks the additional scope
required by that endpoint. No secret value was requested or exposed.

## Merge Enforcement Activation

Do not require a status check until it has completed successfully at least once.

1. Add an independent maintainer or move the repository into an organization with
   distinct application, AppSec, and platform/release owners.
2. Run this implementation through a pull request and verify these exact checks:
  `Quality Gate / Validate`, `Code Quality / Lint`,
  `CodeQL / Analyze (javascript-typescript)`, and `Dependency Review / Dependency Review`.
3. Create an active `main` ruleset requiring pull requests, independent approval,
   code-owner review, stale-approval dismissal, latest-push approval, resolved review
   conversations, and the successful checks above.
4. Block force pushes and branch deletion. Restrict bypass to accountable reviewers and
   require a reason.
5. Run a disposable pull request with one harmless failing check. Prove a normal
   contributor cannot merge, then fix it, obtain independent approval, and preserve the
   non-sensitive evidence.

## Remaining Negative Tests

- Push a synthetic value matching a published custom pattern and prove push protection
  blocks it without bypass.
- Introduce a known high-severity test dependency on a disposable branch and prove
  Dependency Review blocks it, then update to a patched version.
- Add an inert CodeQL fixture on a disposable branch and prove the expected alert and
  merge block, then remove it and verify the alert closes.
- Add a harmless unused value on a disposable branch and prove `Code Quality / Lint`
  fails, then remove it and verify the check passes.
- Submit a benign private vulnerability report and verify private routing.
- Trigger a benign audited setting event and verify its source evidence and approved
  audit destination.

## Evidence Table

| Control | Owner | Configuration/evidence | Negative test | Status | Exception/expiry |
|---|---|---|---|---|---|
| Security configuration | `@melabadi` | This rollout record | Pending | Partial | Independent reviewer required |
| Secret scanning and push protection | `@melabadi` | Repository settings | Pending | Enabled, not proven | Enhanced detection unavailable |
| CodeQL | `@melabadi` | `.github/workflows/codeql.yml` | Pending | Configured | Intentional findings retained |
| Dependency graph and Dependabot | `@melabadi` | `.github/dependabot.yml` | Pending | Enabled/configured | None |
| Dependency Review | `@melabadi` | `.github/workflows/dependency-review.yml` | Pending | Configured | None |
| CI quality gate | `@melabadi` | `.github/workflows/quality-gate.yml` | Pending | Local pass | No automated test suite |
| Code quality lint gate | `@melabadi` | `.github/workflows/code-quality.yml`, `eslint.config.mjs` | Pending | Local pass | Native GitHub Code Quality unavailable here |
| Ruleset and CODEOWNERS | `@melabadi` | `.github/CODEOWNERS` | Pending | Blocked | Independent reviewer required |
| Deployment protection | `@melabadi` | `SECURITY.md` | Not applicable | Deployment prohibited | None |
| Audit and SIEM | `@melabadi` | Not configured | Pending | Blocked | Destination and retention required |
| Copilot, AI, and MCP policy | `@melabadi` | Operations guide and Copilot instructions | Review pending | Documented | None |