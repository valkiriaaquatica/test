# Terraform Module Skill

## Use This Skill When

Use this skill when the task is about:

- adding or changing variables in `modules/*`
- improving module ergonomics
- making Terraform changes with minimal blast radius
- keeping module inputs and outputs consistent

## Goal

Produce Terraform module changes that are explicit, backward-conscious, and easy to review.

## Workflow

1. Inspect the target module first.
2. Identify whether the request belongs in `modules/` or `iac/`.
3. Prefer variable-driven changes instead of hardcoded values.
4. Keep descriptions and types up to date.
5. Avoid introducing breaking changes unless requested.

## Review Checklist

- Is the variable name precise?
- Does every variable have a `description`?
- Is the variable typed?
- Is the default safe?
- Would this change surprise existing consumers?
- Should the change live in a module or in the calling IaC layer?

## Good Practices

- Prefer explicit booleans for toggles.
- Prefer maps/objects only when there is a real need for grouped configuration.
- Keep examples or demos out of module code.
- If adding security-sensitive inputs, document expected values clearly.

## Validation

Run, when available:

1. `terraform fmt -check -recursive`
2. `terraform validate`
3. `tflint`

If validation cannot run, state what was not available.
