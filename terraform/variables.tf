variable "aws_region" {
  type    = string
  default = "af-south-1" # Cape Town
}

variable "environment" {
  type    = string
  default = "production"
}
variable "project_name" {
  description = "Project Name"
  type        = string
  default     = "iec-voting"
}
variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "AZs to use for High Availability"
  type        = list(string)
  default     = ["af-south-1a", "af-south-1b"]
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "database_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.20.0/24", "10.0.21.0/24"]
}