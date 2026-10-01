variable "project_name" {
  description = "Prefixo usado no nome dos recursos"
  type        = string
  default     = "site-consultoria"
}

variable "environment" {
  description = "Ambiente (dev, prod)"
  type        = string
  default     = "prod"
}

variable "cloudfront_price_class" {
  description = "Classe de preço do CloudFront"
  type        = string
  default     = "PriceClass_100"
}