output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}

output "kms_key_arn" {
  description = "The ARN of the KMS Master Key"
  value       = aws_kms_key.main.arn
}
output "public_subnets" {
  value = aws_subnet.public[*].id
}

output "private_subnets" {
  value = aws_subnet.private[*].id
}

output "database_subnets" {
  value = aws_subnet.database[*].id
}

output "nat_gateway_ip" {
  value = aws_eip.nat.public_ip
}

output "alb_dns_name" {
  value = aws_lb.main.dns_name
}
output "rds_endpoint" {
  value = aws_db_instance.main.endpoint
}
output "ecs_execution_role_arn" {
  value = aws_iam_role.ecs_task_execution_role.arn
}

output "db_secret_arn" {
  value = aws_secretsmanager_secret.db_password.arn
}
output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}
output "assets_bucket_name" {
  value = aws_s3_bucket.assets.id
}

output "waf_acl_arn" {
  value = aws_wafv2_web_acl.main.arn
}

