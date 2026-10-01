locals {
  name = "${var.project_name}-${var.environment}"
}

# Senha do banco gerada aleatoriamente e guardada no Secrets Manager —
# nunca fica em texto puro em nenhum arquivo do repositório.
resource "random_password" "db_password" {
  length  = 32
  special = false # evita caracteres que quebram a connection string
}

resource "aws_secretsmanager_secret" "db_credentials" {
  name        = "${local.name}-db-credentials"
  description = "Credenciais do PostgreSQL (RDS) do ${var.project_name}"
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id

  secret_string = jsonencode({
    username = var.db_username
    password = random_password.db_password.result
    host     = aws_db_instance.this.address
    port     = aws_db_instance.this.port
    dbname   = var.db_name
    # URL já pronta para o DATABASE_URL do Prisma / da Lambda
    database_url = "postgresql://${var.db_username}:${urlencode(random_password.db_password.result)}@${aws_db_instance.this.address}:${aws_db_instance.this.port}/${var.db_name}?schema=public"
  })
}

# Sub-redes privadas onde o RDS efetivamente fica
resource "aws_db_subnet_group" "this" {
  name       = "${local.name}-db-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name = "${local.name}-db-subnet-group"
  }
}

# Só a Lambda (via seu Security Group) pode falar com o banco na porta 5432.
# Nada de 0.0.0.0/0 aqui — o RDS não é público.
resource "aws_security_group" "db" {
  name        = "${local.name}-db-sg"
  description = "Permite acesso ao PostgreSQL apenas a partir da Lambda do backend"
  vpc_id      = var.vpc_id

  egress {
    description = "Saída liberada (padrão)"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${local.name}-db-sg"
  }
}

resource "aws_security_group_rule" "db_from_lambda" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.db.id
  source_security_group_id = var.lambda_security_group_id
  description               = "Acesso à Lambda do backend (Node + Express)"
}

resource "aws_db_parameter_group" "this" {
  name   = "${local.name}-pg16"
  family = "postgres16"

  parameter {
    name  = "log_min_duration_statement"
    value = "1000" # loga queries acima de 1s — ajuda a achar N+1 e afins
  }
}

resource "aws_db_instance" "this" {
  identifier     = "${local.name}-db"
  engine         = "postgres"
  engine_version = var.db_engine_version

  instance_class    = var.db_instance_class
  allocated_storage = var.db_allocated_storage
  storage_type      = "gp3"
  storage_encrypted = true

  db_name  = var.db_name
  username = var.db_username
  password = random_password.db_password.result
  port     = 5432

  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = [aws_security_group.db.id]
  parameter_group_name   = aws_db_parameter_group.this.name

  publicly_accessible = false
  multi_az             = var.multi_az

  backup_retention_period = var.backup_retention_days
  backup_window            = "05:00-06:00"
  maintenance_window       = "mon:06:30-mon:07:30"

  deletion_protection       = var.deletion_protection
  skip_final_snapshot       = !var.deletion_protection
  final_snapshot_identifier = var.deletion_protection ? "${local.name}-db-final-snapshot" : null

  auto_minor_version_upgrade = true

  tags = {
    Name        = "${local.name}-db"
    Project     = var.project_name
    Environment = var.environment
  }
}
