# 🗳️ Cloud-Native Secure Voting Infrastructure

A high-availability, security-hardened infrastructure stack designed for **national-scale digital voting systems**. This project demonstrates a **Zero-Trust architecture**, emphasizing deep network isolation, asynchronous processing, compliance alignment, and full CI/CD automation.

---

# 📌 Project Overview

This system ensures that **core services (API & Database) are never exposed to the public internet**, while maintaining:

- Scalability
- Resiliency
- Operational efficiency
- Security and compliance alignment

###  Key Principles
- Zero Trust Networking
- Event-Driven Architecture
- Infrastructure as Code (Terraform)
- Immutable Deployments
- Compliance-Aligned Design (SOC2, ISO 27001 principles)

---

#  Architecture & Traffic Flow

##  1. Edge Layer (Public)

- **CloudFront**
  - SSL/TLS termination
  - Serves static content (frontend)
  - Hides origin infrastructure

- **AWS WAF**
  - Protects against SQL Injection & XSS attacks
  - Enforces IP whitelists/blacklists

- **Application Load Balancer (ALB)**
  - Public subnet
  - Accepts traffic **only from CloudFront**
  - Routes requests to ECS backend services

---

##  2. Compute Layer (Private)

- **ECS Fargate**
  - Runs containerized microservices (frontend API proxy & backend)
  - Deployed in private subnets
  - No public IP addresses

- **NAT Gateway**
  - Provides outbound-only internet access for:
    - Pulling Docker images from ECR
    - Sending logs and metrics to CloudWatch

- **Subnet Placement**
  - Private subnets spread across multiple AZs for HA
  - Security groups enforce:
    - Backend services accept traffic **only from ALB**
    - Outbound traffic through NAT only

---

##  3. Messaging & Data Layer

- **Amazon SQS**
  - Buffers incoming vote requests
  - Enables asynchronous processing
  - Prevents backend overload
  - Network restricted to ECS and VPC endpoints

- **Amazon RDS (PostgreSQL)**
  - Hosted in isolated subnets (no public access)
  - Only accessible by backend ECS tasks
  - Encrypted at rest via KMS
  - Automated backups and snapshots

---

#  Network Flow & Communication

```text
[Users/Browser] 
      |
      v
  [CloudFront CDN]
      |
      v
     [ALB - Public Subnet]
      |
      v
  [ECS Backend Tasks - Private Subnet]
      |          \
      |           \
      v            v
   [SQS Queue]   [RDS DB - Isolated]
   # Cloud-Native Secure Voting Infrastructure

A high-availability, security-hardened infrastructure stack designed for national-scale digital balloting. Built with **Terraform**, this project demonstrates a **Zero-Trust** architecture focusing on deep network isolation, asynchronous processing, and South African data sovereignty compliance.

---

## Microservices Architecture

### Frontend Service
*   **Tech Stack:** HTML, CSS, JavaScript.
*   **Delivery:** Served via an Nginx container.
*   **Communication:** Interacts with the Backend API via the Internal Load Balancer.

###  Backend Service
*   **Tech Stack:** Node.js + Express API.
*   **Logic:** Validates incoming votes and enqueues messages to SQS.
*   **Storage:** Reads/writes to the RDS PostgreSQL database.
*   **Observability:** Streams application logs to CloudWatch.

###  Messaging Worker
*   **Logic:** Consumes messages from SQS.
*   **Processing:** Performs vote processing asynchronously to prevent API latency.
*   **Scaling:** Scales independently from the API layer based on SQS queue depth.

---

##  CI/CD Pipeline (GitHub Actions)



Automates the full lifecycle from code commit to production deployment.

### 🔄 Pipeline Flow
1.  **Trigger:** Push to the `main` branch.
2.  **Build:** Generates Docker images for frontend, backend, and worker services.
3.  **Versioning:** Images are tagged using the unique Git commit SHA for immutability.
4.  **Push:** Images are stored in **Amazon ECR**.
5.  **Infrastructure Sync:** Terraform validates and applies changes to VPC, ECS, RDS, and SQS.
6.  **Deployment:** Updates ECS Task Definitions and triggers a **Zero-Downtime Rolling Deployment**.

---

## 🔒 Security & Compliance

This infrastructure is **designed to align with SOC2, ISO 27001, and PCI DSS principles**, ensuring data confidentiality, integrity, and availability. Security controls are implemented at every layer to maintain compliance with regulatory standards.

### 1. Encryption
**AWS KMS (AES-256)** is applied to all sensitive resources:
* **S3 Buckets** – All assets and logs are encrypted to comply with ISO 27001 A.10.1 and SOC2 CC6.1
* **RDS Databases** – Encrypted at rest and in transit (ISO 27001 A.10.1, SOC2 CC6.1)
* **ECR Image Repositories** – Container images are stored securely with encryption (ISO 27001 A.10.1)
* **SQS Queues** – All messages encrypted to prevent data leakage (SOC2 CC6.1, ISO 27001 A.10.1)

### 2. Audit & Monitoring
Continuous monitoring is implemented to meet ISO 27001 A.12 and SOC2 CC7.1 requirements:
* **AWS CloudTrail** – Records all API activity, enabling full auditability
* **AWS Config** – Detects misconfigurations and enforces compliance rules
  - Prevents public S3 buckets
  - Disallows overly permissive security groups
* **AWS GuardDuty** – Provides threat detection and anomaly monitoring
* **CloudWatch Logs & Metrics** – Tracks operational activity for security and compliance reporting

### 3. Access Control
* **IAM Policies** – Principle of least privilege applied (ISO 27001 A.9.1)
* **Security Groups & NACLs** – Segmented by subnet type to enforce network isolation
* **VPC Endpoints** – Internal services communicate privately without exposing traffic to the public internet

### 4. Compliance Automation
* Infrastructure as Code (Terraform) ensures repeatable, auditable deployments
* CI/CD pipeline enforces security checks, image scanning, and automated deployment validation
* Versioning and immutability of Docker images maintain traceability and integrity (SOC2 CC6.2)


### Audit & Monitoring
*   **CloudTrail:** Logs all API activity within the account.
*   **AWS Config:** Automatically detects and alerts on resource misconfigurations.
*   **GuardDuty:** ML-driven threat detection for malicious network activity.

###  Data Sovereignty
*   **Region:** `af-south-1` (Cape Town).
*   **Compliance:** Ensures all sensitive electoral data remains within South African borders.

---

##  Network Security Model

| Component | Subnet Type | Access Control |
| :--- | :--- | :--- |
| **ALB Load Balancer** | Public | Inbound: CloudFront IPs Only |
| **ECS Tasks** | Private | Inbound: ALB Only | Outbound: NAT Gateway |
| **SQS Queue** | Internal | Access via VPC Interface Endpoint |
| **RDS Database** | Isolated | Inbound: ECS Tasks Only |

---

## 🔧 Future Improvements
*   **Autoscaling:** Implementation of Target Tracking scaling based on SQS `ApproximateNumberOfMessagesVisible`.
*   **Monitoring:** Integration of CloudWatch Alarms with SNS notifications for real-time alerting.
*   **Secrets Management:** Dynamic rotation of database credentials using **AWS Secrets Manager**.
*   **Deployment Strategies:** Introduction of **Canary Deployments** and automated rollbacks via AWS CodeDeploy.
* Integration with AWS Security Hub for centralized compliance reporting
* Automated remediation scripts for non-compliant resources
* Formal third-party ISO 27001 and SOC2 audit preparation
* Incorporation of GDPR and POPIA compliance for data handling policies
.
├── .github/
│   └── workflows/
│       └── deploy.yml        
├── terraform/
│   ├── main.tf               
│   ├── variables.tf
│   └── outputs.tf
├── backend/
│   ├── app.js
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── Dockerfile
├── docker-compose.yml        
├── .gitignore
└── README.md