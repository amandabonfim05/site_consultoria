output "bucket_name" {
  description = "Nome do bucket S3 — usado no comando de sync do deploy"
  value       = aws_s3_bucket.frontend.id
}

output "cloudfront_distribution_id" {
  description = "ID da distribuição CloudFront — usado para invalidar o cache após cada deploy"
  value       = aws_cloudfront_distribution.frontend.id
}

output "site_url" {
  description = "URL pública do site"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}