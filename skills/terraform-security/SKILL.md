# Terraform Security Review Skill

## Use This Skill When

Use this skill when reviewing or changing Terraform that may affect:

- IAM permissions
- public access
- networking exposure
- encryption
- logging and auditability
- secrets handling

## Goal

Catch risky infrastructure defaults early and make the security impact explicit.

## Security Heuristics

Always check for:

- wildcard IAM actions or resources
- public buckets, endpoints, or ingress
- encryption disabled or not configurable
- missing retention or logging controls
- credentials or secrets embedded in code
- insecure defaults that are enabled automatically

## Expected Output

When reporting findings or making changes, state:

1. what is risky
2. why it matters
3. whether the risk is current or potential
4. what configuration would reduce the risk

## Tooling Context

Use the repo tooling correctly:

- `gitleaks` for leaked secrets
- `CodeQL` for code-level security patterns in demos or supported languages
- Terraform review for IaC misconfiguration itself

Do not claim that CodeQL fully covers Terraform security. It does not.

## Validation

If local tools exist, prefer:

1. `terraform fmt -check -recursive`
2. `terraform validate`
3. `tflint`

If additional IaC security scanners are later added, include them in the review flow.
