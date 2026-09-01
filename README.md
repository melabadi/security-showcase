# security-showcase

> Intentionally vulnerable reference repository for the **GHCP + GHE
> Security Architecture** showcase.
>
> **DO NOT DEPLOY.** Every file in `frontend/` and `backend/` contains at
> least one deliberate vulnerability so CodeQL, Semgrep, Snyk, Trivy,
> Dependabot, Secret Scanning, Push Protection, and the custom security
> agent have something to find on stage. ESLint is a separate quality gate
> that passes on the documented teaching baseline.

---

## What this repo demonstrates

Mapped 1:1 to the deck slides:

| Slide | Concept                               | Where it lives in this repo                                              |
| :---: | ------------------------------------- | ------------------------------------------------------------------------ |
| 3     | Deterministic vs. probabilistic       | This README + `.github/copilot-instructions.md`                          |
| 5     | Custom security agent (orchestrator)  | [.github/agents/security-orchestrator.agent.md](.github/agents/security-orchestrator.agent.md)                   |
| 6     | Curated security MCP toolbox          | [.vscode/mcp.json](.vscode/mcp.json)                                                                             |
| 7     | Triage agent + skills                 | [.github/agents/vulnerability-triage.agent.md](.github/agents/vulnerability-triage.agent.md) + [.github/skills/](.github/skills/) |
| 8     | Agentic "scan → reason → file issues" | [.github/workflows/security-scan-report.md](.github/workflows/security-scan-report.md) + [.github/workflows/security-issues-from-findings.md](.github/workflows/security-issues-from-findings.md) (authored with `gh aw`) |
| 10    | CodeQL                                | [.github/workflows/codeql.yml](.github/workflows/codeql.yml)           |
| 11    | Dependabot                            | [.github/dependabot.yml](.github/dependabot.yml) + [.github/workflows/dependency-review.yml](.github/workflows/dependency-review.yml) |
| 12    | Secret scanning                       | [.github/secret_scanning.yml](.github/secret_scanning.yml) + [backend/.env.example](backend/.env.example) |
| 13    | Push protection                       | Enabled in repo settings (documented in [SECURITY.md](SECURITY.md))      |
| 15    | Layered SDLC story                    | All of the above together                                                |

## Live demo examples

Open each linked evidence comment first; it explains what the control detected and
which checks should pass or fail. PR #70 is a real Dependabot remediation and still
requires normal compatibility and human review. PRs #72 through #75 and #77 are
disposable teaching artifacts: **do not merge or deploy them.**

| Capability | Live example | What to show | Expected result |
|---|---|---|---|
| Dependabot remediation | [PR #70](https://github.com/melabadi/security-showcase/pull/70) and [evidence](https://github.com/melabadi/security-showcase/pull/70#issuecomment-5486741020) | A bot-authored dependency update proceeding through normal review | Dependency Review and CodeQL pass; compatibility and human review are still required |
| Code scanning / CodeQL | [PR #72](https://github.com/melabadi/security-showcase/pull/72), [evidence](https://github.com/melabadi/security-showcase/pull/72#issuecomment-5486740759), and [failing CodeQL check](https://github.com/melabadi/security-showcase/runs/99897052616) | One critical command-injection alert, one high missing-rate-limiting alert, and PR annotations | CodeQL blocks the PR while build and dependency checks pass |
| Dependency Review | [PR #73](https://github.com/melabadi/security-showcase/pull/73) and [evidence](https://github.com/melabadi/security-showcase/pull/73#issuecomment-5486740905) | A newly introduced direct dependency with a critical advisory | Dependency Review blocks the PR while CodeQL and Quality Gate pass |
| Secret scanning | [PR #74](https://github.com/melabadi/security-showcase/pull/74) and [evidence](https://github.com/melabadi/security-showcase/pull/74#issuecomment-5486851244) | A synthetic provider-pattern alert in the repository Security view | The secret alert opens even though the Actions checks pass |
| Copilot Autofix review | [PR #75](https://github.com/melabadi/security-showcase/pull/75) and [evidence](https://github.com/melabadi/security-showcase/pull/75#issuecomment-5486877256) | An Autofix that narrows command injection, followed by deterministic rescan and human review | A new high-severity finding and residual risks keep the proposal from being merge-ready |
| Repository code quality | [PR #77](https://github.com/melabadi/security-showcase/pull/77), [evidence](https://github.com/melabadi/security-showcase/pull/77#issuecomment-5493565456), and [CodeQL PR check](https://github.com/melabadi/security-showcase/runs/99898147432) | One harmless unused value, the failing ESLint annotation, and one nonblocking CodeQL quality note | `Code Quality / Lint` fails alone; build, Dependency Review, and PR security status pass |
| Push protection | No PR by design; use the [safe drill procedure](docs/security/OPERATIONS.md#safe-drills) | A normal push rejected before the synthetic provider credential reaches GitHub history | No bypass, remote branch, or pull request is created |

Suggested flow: start with #70 versus #73 for dependency remediation and prevention,
then show #72, #75, #74, and #77. Finish with push protection because its successful
outcome is the absence of a remote branch or pull request.

> **Alert access:** GitHub security-alert detail pages are permission-gated and may
> return 404 unless the signed-in account can read that repository's security alerts.
> The links above default to public PR comments and check runs. Authorized presenters
> can open the underlying findings from **Security and quality**.

The repository delivery baseline also includes reproducible build and code-quality
gates, immutable action pins, CODEOWNERS, private vulnerability reporting,
expiring security exceptions, and an evidence-based rollout record. See
[docs/security/ROLLOUT.md](docs/security/ROLLOUT.md) for current enforcement
status and [docs/security/OPERATIONS.md](docs/security/OPERATIONS.md) for the
maintainer runbook.

---

## Repository layout

```
.
├── package.json                  # Repository-level ESLint tooling
├── eslint.config.mjs             # Backend and frontend quality rules
├── frontend/                     # React + Vite (intentionally vulnerable)
├── backend/                      # Node/Express mock API (intentionally vulnerable)
├── .vscode/
│   └── mcp.json                  # Hosted MCP servers (no tokens, no CLIs)
├── .github/
│   ├── copilot-instructions.md   # Repo-wide guardrails for Copilot
│   ├── CODEOWNERS                # Ownership; independent review is a documented blocker
│   ├── dependabot.yml            # Slide 11
│   ├── pull_request_template.md  # Risk, AI provenance, and validation evidence
│   ├── SECURITY_EXCEPTION.md     # Private, expiring exception record template
│   ├── secret_scanning.yml       # Slide 12 custom patterns
│   ├── agents/
│   │   ├── agentic-workflows.agent.md      # gh-aw dispatcher agent
│   │   ├── security-orchestrator.agent.md  # Custom agent (slide 5)
│   │   ├── vulnerability-triage.agent.md   # Custom agent (slide 7)
│   │   └── redteam.agent.md                # Playwright-driven red-team agent
│   ├── skills/
│   │   ├── scan-repository/SKILL.md              # Slash command: /scan-repository
│   │   └── create-vulnerability-issues/SKILL.md  # Slash command: /create-vulnerability-issues
│   ├── instructions/
│   │   └── secure-javascript.instructions.md
│   └── workflows/
│       ├── codeql.yml                              # Slide 10
│       ├── code-quality.yml                        # Repository-owned ESLint gate
│       ├── dependency-review.yml                   # Slide 11
│       ├── quality-gate.yml                        # Reproducible install/check/build gate
│       ├── security-scan-report.md                 # Agentic workflow #1 (source)
│       ├── security-scan-report.lock.yml           # Compiled by `gh aw compile`
│       ├── security-issues-from-findings.md        # Agentic workflow #2 (source)
│       └── security-issues-from-findings.lock.yml  # Compiled by `gh aw compile`
```

---

## MCP servers wired up (slide 6)

[.vscode/mcp.json](.vscode/mcp.json) registers six **hosted, tokenless** MCP servers. The custom
agents and skills reference these by name:

| MCP server           | Purpose in the demo                                                 |
| -------------------- | ------------------------------------------------------------------- |
| `github`             | Read CodeQL / Dependabot / Secret Scanning alerts; open issues      |
| `microsoft-learn`    | Authoritative Microsoft / Azure security guidance & runbooks        |
| `deepwiki`           | High-level architectural context for popular OSS projects           |
| `context7`           | Up-to-date official docs and code samples for libraries in use      |
| `owasp-cheatsheets`  | OWASP Cheat Sheet Series for prevention guidance per vuln class     |
| `github-advisories`  | GitHub Advisory Database — authoritative CVE / GHSA lookups         |
| `playwright`         | Microsoft Playwright MCP — browser automation for the red-team agent |

The six HTTP servers are tokenless (`github` is authenticated via Copilot).
`playwright` is run locally by VS Code via `npx @playwright/mcp@latest` — no
auth either, but it needs `npx` on PATH.

---

## Custom agents and skills (slide 5 + 7)

Two VS Code **custom agents** live under [.github/agents/](.github/agents/):

- **Security Orchestrator** — [.github/agents/security-orchestrator.agent.md](.github/agents/security-orchestrator.agent.md) — the
  probabilistic brain. Plans, calls MCP servers, produces a report, and
  delegates to workflows for irreversible actions.
- **Vulnerability Triage** — [.github/agents/vulnerability-triage.agent.md](.github/agents/vulnerability-triage.agent.md) — clusters
  and explains existing GHE alerts (CodeQL + Dependabot + Secret Scanning).
- **Red-team** — [.github/agents/redteam.agent.md](.github/agents/redteam.agent.md) — drives a real browser through
  the **Playwright MCP** to confirm exploits hands-on against the locally
  running demo app, with strict rules of engagement (local only, no
  destructive payloads, marker-only probes).

Two **agent skills** (slash-command workflows) live under [.github/skills/](.github/skills/):

- `/scan-repository` — [.github/skills/scan-repository/SKILL.md](.github/skills/scan-repository/SKILL.md)
- `/create-vulnerability-issues` — [.github/skills/create-vulnerability-issues/SKILL.md](.github/skills/create-vulnerability-issues/SKILL.md)

Both agents and skills are governed by
[.github/copilot-instructions.md](.github/copilot-instructions.md) and
[.github/instructions/secure-javascript.instructions.md](.github/instructions/secure-javascript.instructions.md).

---

## Agentic workflows (slide 8)

Both workflows are authored in Markdown under [.github/workflows/](.github/workflows/) and compiled
to GitHub Actions YAML with [`gh aw`](https://github.com/github/gh-aw) (GitHub Agentic
Workflows). The `.md` file is the source of truth; the matching `.lock.yml` is generated
by `gh aw compile` and committed alongside it.

### 1. Scan + report — [.github/workflows/security-scan-report.md](.github/workflows/security-scan-report.md)

Runs on push to `main`, on a daily schedule, and on demand. The Copilot agent:

1. Pulls existing **CodeQL**, **Dependabot**, and **Secret Scanning** alerts via the
   `github` MCP toolsets (`code_security`, `dependabot`, `secret_protection`).
2. Runs fresh `npm audit` in both workspaces via the bash tool.
3. Clusters findings, drops anything without a deterministic source, and writes
   `reports/security-scan-<timestamp>.md`.
4. Uploads the report as a workflow asset and (if an open PR exists) comments a link.

### 2. File issues — [.github/workflows/security-issues-from-findings.md](.github/workflows/security-issues-from-findings.md)

Triggered automatically when workflow #1 finishes on `main`, or manually. The agent:

1. Downloads the latest scan report artifact.
2. Clusters findings by `(tool, rule-id)` and attaches a fingerprint marker.
3. Searches existing open issues by fingerprint and either comments on the
   existing one or opens a new `[security] …` issue with the `security` +
   `auto-triage` labels — one issue per cluster, no duplicates.

Rebuild both workflows locally with:

```bash
gh extension install github/gh-aw   # one-time
gh aw compile                        # regenerates the .lock.yml files
```

---

## Built-in GHE controls (slides 10-13)

| Control           | Status     | Config file                                                        |
| ----------------- | ---------- | ------------------------------------------------------------------ |
| Quality Gate      | Configured | [.github/workflows/quality-gate.yml](.github/workflows/quality-gate.yml) |
| Code Quality      | Configured | [.github/workflows/code-quality.yml](.github/workflows/code-quality.yml) and [eslint.config.mjs](eslint.config.mjs) |
| CodeQL            | Configured | [.github/workflows/codeql.yml](.github/workflows/codeql.yml)     |
| Dependabot        | Enabled    | [.github/dependabot.yml](.github/dependabot.yml)                 |
| Dependency Review | Configured | [.github/workflows/dependency-review.yml](.github/workflows/dependency-review.yml) |
| Secret Scanning   | Enabled    | [.github/secret_scanning.yml](.github/secret_scanning.yml)       |
| Push Protection   | Enabled    | See [SECURITY.md](SECURITY.md)                                    |
| Private Reporting | Enabled    | See [SECURITY.md](SECURITY.md)                                    |

`Code Quality / Lint` is a repository-owned ESLint check. It is intentionally
distinct from the separately licensed [GitHub Code Quality](https://docs.github.com/en/code-security/concepts/code-quality/code-quality)
product, whose managed PR check is named `CodeQL - Code Quality / Analyze`.
[Draft PR #77](https://github.com/melabadi/security-showcase/pull/77) demonstrates
the lint check rejecting one harmless unused value while the build and PR security
status checks pass. The existing CodeQL `security-and-quality` suite also records a
nonblocking quality note in the [public PR check](https://github.com/melabadi/security-showcase/runs/99898147432).
See [Live demo examples](#live-demo-examples) for the complete security and quality
demonstration set.

Configured checks are not merge-enforced yet. The repository currently has only
one maintainer; [the rollout record](docs/security/ROLLOUT.md) keeps ruleset
activation blocked until independent review exists and each check has passed at
least once.

---

## Running the vulnerable app locally (demo only)

```bash
# backend
cd backend
npm install
npm start            # :4000

# frontend (separate shell)
cd frontend
npm install
npm run dev          # :5173 proxied to the backend
```

Open `http://localhost:5173` and try `/search`, `/profile?p=...`, and
`/admin` to exercise the intentional XSS / SQLi / prototype-pollution /
command-injection bugs.

---

## Safety

- Every credential in this repo matches a scanner pattern but is **not a
  valid secret** (e.g. `AKIAIOSFODNN7EXAMPLE`).
- Keep all disposable demo pull requests draft; never merge or deploy them.
- Do not enable deployments, do not expose these services to the public
  internet, do not re-use any code from this repo in production.
- See [SECURITY.md](SECURITY.md) for the demo checklist.

