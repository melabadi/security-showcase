# Security Policy

This repository is intentionally vulnerable and exists only for the GHCP and GHE
Security Architecture demonstration. Never deploy the applications in `frontend/` or
`backend/`, and treat all repository content as untrusted.

## Reporting A Vulnerability

Do not open a public issue for a suspected vulnerability or exposed credential.

Report privately through [GitHub private vulnerability reporting](https://github.com/melabadi/security-showcase/security/advisories/new).
If private reporting is unavailable, contact `@melabadi` through an existing trusted
private channel. Do not include active credentials, personal data, or exploit material
in a public message.

Include affected revisions, safe reproduction steps, impact, and a minimal proof of
concept. Reports about the deliberate findings in the demo applications are useful only
when they identify an undocumented impact or a failure in the surrounding containment.

## Response Targets

- Acknowledge reports within 2 business days.
- Triage critical reports within 1 business day.
- Revoke and rotate any potentially active credential immediately, then investigate use.
- Set remediation timing from severity, exploitability, exposure, and affected releases.

## Supported Versions

| Component | Supported |
|---|---|
| Security tooling on `main` | Yes |
| `frontend/` and `backend/` demo applications | No; intentionally vulnerable and non-deployable |
| Older revisions or releases | No |

## Disclosure

Coordinate disclosure privately with `@melabadi`. Do not publish details before a fix,
containment decision, and communication plan are ready.

## Security Exceptions

Use [.github/SECURITY_EXCEPTION.md](.github/SECURITY_EXCEPTION.md) in a private security
tracking system. Every accepted risk needs an accountable owner, an independent
approver, a compensating control, a remediation plan, and an expiry date.

## Pre-Demo Control Check

In **Settings > Code security and analysis**, confirm:

- [ ] Advanced CodeQL setup is healthy and default setup is disabled.
- [ ] Dependency graph, Dependabot alerts, and security updates are enabled.
- [ ] Secret scanning, push protection, validity checks, and non-provider patterns are enabled.
- [ ] The custom patterns documented in `.github/secret_scanning.yml` were dry-run and published in repository settings.
- [ ] Private vulnerability reporting is enabled.

After all checks have completed successfully at least once, confirm the `main` ruleset:

- [ ] Pull requests and an independent approval are required.
- [ ] Code-owner review and dismissal of stale approvals are required.
- [ ] Review conversations must be resolved.
- [ ] `Quality Gate / Validate`, `Code Quality / Lint`, `CodeQL / Analyze (javascript-typescript)`, and `Dependency Review / Dependency Review` are required.
- [ ] Force pushes and branch deletion are blocked.
- [ ] Bypass is restricted, justified, and audited.

See [docs/security/OPERATIONS.md](docs/security/OPERATIONS.md) for alert handling and
[docs/security/ROLLOUT.md](docs/security/ROLLOUT.md) for enforcement status and evidence.
