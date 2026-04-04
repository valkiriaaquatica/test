# GitHub Actions For IaC Skill

## Use This Skill When

Use this skill when the task involves:

- adding or editing files in `.github/workflows/`
- explaining CI/security automation in this repo
- deciding which tool should handle which concern

## Goal

Keep workflow changes scoped, understandable, and aligned with the purpose of each tool.

## Repo Workflow Map

Current examples in this repo cover:

- `CodeQL`: code analysis example
- `Gitleaks`: secret scanning
- `Super-Linter`: linting and formatting
- `Codecov`: coverage upload
- `release-please`: release automation

## Decision Rules

Use the right workflow for the right job:

- security pattern in source code -> CodeQL
- secret exposure -> Gitleaks
- formatting/lint -> Super-Linter
- test coverage -> Codecov
- release/version automation -> release-please

## Editing Guidelines

1. Keep workflows separate by concern.
2. Prefer explicit `paths` filters for example-only workflows.
3. Explain token or secret requirements clearly.
4. Avoid adding broad permissions unless required.
5. If a workflow is intentionally expected to fail for demo purposes, document that clearly.

## Final Check

After changing a workflow, verify:

- trigger conditions make sense
- permissions are minimal
- paths and filenames referenced by the workflow actually exist
- README or demo docs reflect the workflow behavior
