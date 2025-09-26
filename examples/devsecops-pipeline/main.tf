// Minimal Terraform example (replace provider and variables for your environment)
terraform {
  required_version = ">= 1.0"
}

provider "null" {}

resource "null_resource" "example" {
  provisioner "local-exec" {
    command = "echo 'Provision placeholder'"
  }
}
