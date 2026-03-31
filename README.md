# 🗳️ Cloud-Native Secure Voting Infrastructure

A high-availability, security-hardened infrastructure stack designed for **national-scale digital voting systems**. This project demonstrates a **Zero-Trust architecture**, emphasizing deep network isolation, asynchronous processing, South African data sovereignty (POPIA) compliance, and full CI/CD automation.

---

## 📌 Project Overview

This system is engineered to ensure that **core services (API & Database) are never exposed to the public internet**, providing a resilient foundation for sensitive electoral data.

###  Key Principles
- **Zero Trust Networking:** Micro-segmentation via security groups and private subnets.
- **Event-Driven Architecture:** Decoupling ingestion from processing via SQS.
- **Infrastructure as Code:** 100% reproducible environment via Terraform.
- **Compliance-Aligned:** Mapping AWS services to ISO 27001 and SOC2 controls.

---

##  Architecture & Traffic Flow

### 1. Edge Layer (Public Ingress)
- **CloudFront & WAF:** Provides global SSL/TLS termination and protects against SQL Injection/XSS.
- **Application Load Balancer (ALB):** Hosted in public subnets but restricted to accept traffic **only** from CloudFront IP ranges via an AWS Managed Prefix List.

### 2. Compute Layer (Private)
- **ECS Fargate:** Runs containerized microservices in private subnets with no public IPs.
- **NAT Gateway:** Enables outbound-only access for pulling ECR images and streaming logs to CloudWatch without exposing the containers to inbound threats.

### 3. Messaging & Data Layer (Isolated)
- **Amazon SQS:** Buffers incoming votes, enabling the system to handle massive traffic spikes without overwhelming the database.
- **Amazon RDS (PostgreSQL):** Hosted in isolated subnets with zero internet access; accessible only by backend ECS tasks.

---

##  Microservices Architecture

| Service | Tech Stack | Responsibility |
| :--- | :--- | :--- |
| **Frontend** | HTML, CSS, JS (Nginx) | Provides the voting UI; proxies requests to the backend. |
| **Backend API** | Node.js + Express | Validates voter credentials and enqueues votes to SQS. |
| **Worker** | Node.js / Worker | Consumes SQS messages and performs async database writes. |

---

## CI/CD Pipeline (GitHub Actions)

Automates the full lifecycle from code commit to production deployment.

1. **Trigger:** Push to the `main` branch.
2. **Build:** Generates Docker images for frontend, backend, and worker.
3. **Versioning:** Images are tagged using the unique Git commit SHA for immutability.
4. **Push:** Images are stored in encrypted **Amazon ECR** repositories.
5. **Infrastructure Sync:** Terraform validates and applies changes to the VPC and resources.
6. **Deployment:** Updates ECS Task Definitions and triggers a **Zero-Downtime Rolling Deployment**.

---

## 🔒 Security & Compliance Alignment

This infrastructure is designed to align with **SOC2, ISO 27001, and POPIA** principles.

### 1. Encryption (Data Protection)
**AWS KMS (AES-256)** is applied to all sensitive resources:
* **S3 Buckets:** Encrypted logs and assets (ISO 27001 A.10.1, SOC2 CC6.1).
* **RDS Databases:** Encrypted at rest and in transit.
* **SQS Queues:** Messages encrypted to prevent internal data leakage.

### 2. Audit & Monitoring
* **AWS CloudTrail:** Full API audit logs for forensic analysis (ISO 27001 A.12.4).
* **AWS Config:** Automated compliance checks (e.g., ensuring no public S3 buckets).
* **AWS GuardDuty:** Continuous ML-driven threat detection.

### 3. Data Sovereignty
* **Region:** `af-south-1` (Cape Town).
* **Compliance:** Ensures all sensitive electoral data remains within South African borders, satisfying local regulatory requirements.

---

##  Network Security Model

| Component | Subnet Type | Access Control |
| :--- | :--- | :--- |
| **ALB Load Balancer** | Public | Inbound: CloudFront IPs Only |
| **ECS Tasks** | Private | Inbound: ALB Only | Outbound: NAT Gateway |
| **SQS Queue** | Internal | Access via VPC Interface Endpoints |
| **RDS Database** | Isolated | Inbound: ECS Tasks Only |

---

##  Project Structure

```text
.
├── .github/workflows/
│   └── deploy.yml          # CI/CD Pipeline
├── terraform/
│   ├── main.tf             # Core Infrastructure
│   ├── variables.tf        # Configurable Params
│   └── outputs.tf          # Resource Endpoints
├── backend/
│   ├── app.js              # Express API
│   └── Dockerfile          # Node.js Prod Image
├── frontend/
│   ├── index.html          # UI
│   └── Dockerfile          # Nginx Static Server
├── docker-compose.yml      # Local Dev Environment
├── .gitignore              # Dependency/Secret exclusion
└── README.md               # Project Documentation