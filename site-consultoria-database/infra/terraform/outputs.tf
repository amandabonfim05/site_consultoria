output "db_instance_endpoint" {
  description = "Endpoint (host:port) do RDS"
  value       = aws_db_instance.this.endpoint
}

output "db_instance_address" {
  description = "Host do RDS (sem a porta)"
  value       = aws_db_instance.this.address
}

output "db_name" {
  value = var.db_name
}

output "db_security_group_id" {
  description = "Security Group do RDS — use para depurar regras de acesso"
  value       = aws_security_group.db.id
}

output "db_credentials_secret_arn" {
  description = "ARN do secret no Secrets Manager com usuário/senha/DATABASE_URL prontos"
  value       = aws_secretsmanager_secret.db_credentials.arn
}

output "database_url_hint" {
  description = "Como montar o DATABASE_URL a partir dos outputs acima (a senha real só está no Secrets Manager, nunca no state em texto legível pelo Terraform CLI)"
  value       = "postgresql://${var.db_username}:<senha-no-secrets-manager>@${aws_db_instance.this.address}:${aws_db_instance.this.port}/${var.db_name}?schema=public"
}
