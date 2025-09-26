# DevSecOps Example Pipeline

This small example demonstrates an opinionated DevSecOps pipeline combining:

- GitHub Actions (CI) to build, test, and run security scans
- Terraform as IaC for provisioning infrastructure
- Checkov to scan Terraform for policy violations
- ArgoCD manifest to deploy application manifests via GitOps

Usage
1. Clone this folder into your repo.
2. Customize `main.tf` with your cloud provider details.
3. Add the GitHub Actions workflow under `.github/workflows/ci.yml` to your repository.
4. Configure ArgoCD to point at your manifests and apply `argocd-app.yaml`.

This example is intentionally minimal; treat it as a starting point to adapt for your org.
