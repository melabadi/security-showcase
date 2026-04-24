---
applyTo: "**/*.{js,jsx,ts,tsx}"
---

# Secure coding skill — JavaScript / TypeScript

When reviewing or generating JS/TS in this repo, apply these deterministic checks.
The orchestrator agent should call Semgrep / CodeQL MCP to confirm any match.

## Anti-patterns to flag

| Pattern                                   | Why                                  | Fix                                    |
| ----------------------------------------- | ------------------------------------ | -------------------------------------- |
| `dangerouslySetInnerHTML`                 | DOM XSS                              | render text, or sanitize (DOMPurify)   |
| `eval(`, `new Function(`                  | RCE                                  | parse / dispatch, never eval           |
| String-concat SQL (`"... '" + x + "'"`)   | SQLi                                 | parameterised queries                  |
| `exec(`, `execSync(` on user input        | Command injection                    | `spawn` with argv array + allowlist    |
| `fetch(userUrl)` server-side              | SSRF                                 | allowlist hosts, block metadata IPs    |
| `jwt.verify(.., { algorithms: ['none'] })`| Alg-none bypass                      | pin to HS256/RS256                     |
| `lodash.merge` on untrusted JSON          | Prototype pollution                  | `Object.assign` + schema validation    |
| `localStorage.setItem('token', ...)`      | XSS-accessible session               | httpOnly cookie                        |
| `cors({ origin: '*', credentials: true })`| Auth bypass                          | explicit origin list                   |
| `path.join(dir, req.query.x)`             | Path traversal                       | `path.resolve` + prefix check          |

## When you see any of these

1. Reference the exact file + line.
2. Name the CWE (only if it came from an MCP call — never invent).
3. Propose a concrete patch.
4. Ask the orchestrator to re-run Semgrep / CodeQL on the patch before claiming "fixed".
