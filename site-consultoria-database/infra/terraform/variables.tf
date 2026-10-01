variable "aws_region" {
  description = "Região AWS onde o RDS será provisionado"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Prefixo usado no nome dos recursos"
  type        = string
  default     = "site-consultoria"
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "vpc_id" {
  description = "VPC onde o RDS e a Lambda vão viver"
  type        = string
}

variable "private_subnet_ids" {
  description = "IDs das sub-redes privadas para o DB Subnet Group"
  type        = list(string)
}

variable "lambda_security_group_id" {
  description = "Security Group da Lambda que terá acesso à porta 5432 do RDS"
  type        = string
}

variable "db_name" {
  description = "Nome do banco de dados"
  type        = string
  default     = "site_consultoria"
}

variable "db_username" {
  description = "Usuário master do banco"
  type        = string
  default     = "site_consultoria_admin"
}

variable "db_instance_class" {
  description = "Classe da instância RDS (db.t4g.micro é elegível ao free tier)"
  type        = string
  default     = "db.t4g.micro"
}

variable "db_allocated_storage" {
  description = "Armazenamento em GB (20GB é o teto do free tier)"
  type        = number
  default     = 20
}

variable "db_engine_version" {
  description = "Versão do PostgreSQL"
  type        = string
  default     = "16.4"
}

variable "backup_retention_days" {
  description = "Dias de retenção de backup automático"
  type        = number
  default     = 3
}

variable "multi_az" {
  description = "Alta disponibilidade (multi-AZ). Fica fora do free tier — mantenha false para o cenário de fluxo pequeno."
  type        = bool
  default     = false
}

variable "deletion_protection" {
  description = "Bloqueia exclusão acidental do banco via Terraform/console"
  type        = bool
  default     = true
}
