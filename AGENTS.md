# AGENTS.md

## Purpose

This repository is primarily a Terraform/IaC workspace with a few small demo folders used to explain security tooling:

- `modules/`: reusable Terraform modules
- `iac/`: environment or solution-level Terraform code
- `.github/workflows/`: CI examples for CodeQL, Gitleaks, Super-Linter, and Codecov
- `examples/`: isolated demo material used for teaching or testing tools

Agents working in this repo should optimize for safe, minimal, reviewable infrastructure changes.

## Working Rules

1. Treat `modules/` and `iac/` as the production surface. Treat `examples/` as teaching material.
2. Do not mix demo code into Terraform paths unless explicitly asked.
3. Prefer small, explicit Terraform changes over broad refactors.
4. Keep variable names, descriptions, and defaults consistent across modules.
5. When changing workflows, explain whether the change affects security scanning, linting, release flow, or coverage reporting.
6. Never remove or weaken security checks silently.
7. If a change touches secrets, IAM, public exposure, encryption, or networking, call that out explicitly in the final summary.

## Repo Mental Model

Use this split when reasoning about changes:

- `modules/*`: reusable building blocks
- `iac/*`: composition and environment-specific usage
- `.github/workflows/*`: automation and policy
- `examples/*`: didactic samples only

If a request is ambiguous, prefer changing the narrowest layer possible.

## Terraform Expectations

When editing Terraform:

1. Keep inputs documented with `description`.
2. Prefer typed variables.
3. Avoid introducing implicit behavior when an explicit variable is clearer.
4. Preserve backwards compatibility in modules unless the user asks for a breaking change.
5. Flag risky defaults, especially around:
   - public access
   - overly broad IAM permissions
   - missing encryption
   - lack of logging
   - unauthenticated ingress

## Validation Workflow

When available, agents should prefer this order:

1. `terraform fmt -check -recursive`
2. `terraform validate`
3. `tflint`
4. repo-specific CI checks if the change touches workflows or examples

If a tool is not installed, say so clearly instead of guessing.

## Security Expectations

Use the tooling in this repo for distinct purposes:

- `CodeQL`: code-pattern and semantic security analysis
- `Gitleaks`: secret detection
- `Super-Linter`: formatting and lint checks
- `Codecov`: test coverage reporting

Do not present these tools as interchangeable.

## Skills Available In-Repo

Agents should consult these local skill files when the task matches:

- `skills/terraform-module/SKILL.md`
- `skills/terraform-security/SKILL.md`
- `skills/github-actions-iac/SKILL.md`

## Preferred Response Style

For infra work, report:

1. what changed
2. why it changed
3. risk or impact
4. what was validated

If validation could not be run, state that directly.
