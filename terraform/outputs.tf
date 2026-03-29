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
