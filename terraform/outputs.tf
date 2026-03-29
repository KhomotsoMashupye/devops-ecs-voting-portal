output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}

output "kms_key_arn" {
  description = "The ARN of the KMS Master Key"
  value       = aws_kms_key.main.arn
}