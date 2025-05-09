# AWS Event-Driven Order Notification System

This project implements an event-driven architecture using AWS services to process and store e-commerce orders and notify services reliably.

---

##  Architecture Overview

- **Amazon SNS (OrderTopic)** – Receives and publishes order messages
- **Amazon SQS (OrderQueue)** – Buffers messages for processing
- **AWS Lambda** – Consumes messages, logs them, and stores order data
- **Amazon DynamoDB (Orders Table)** – Stores structured order data
- **Dead Letter Queue (OrderDLQ)** – Captures failed messages after 3 attempts

## 📊 Architecture Diagram

![Architecture Diagram](docs/architecture.png)

---

##  Setup Instructions

1. **Create DynamoDB Table**
   - Table Name: `Orders`
   - Partition Key: `orderId` (String)

2. **Create SNS Topic**
   - Name: `OrderTopic`

3. **Create SQS Queues**
   - Standard Queue: `OrderQueue`
   - Dead-Letter Queue: `DeadOrderQueue`
   - Configure `OrderQueue` with `DeadOrderQueue`, set maxReceiveCount = 3

4. **Create Lambda Function**
   - Runtime: Node.js 22
   - Trigger: `OrderQueue`
   - Behavior:
     - Parse JSON
     - Insert to `Orders` table
     - Log to CloudWatch

5. **Connect Services**
   - Subscribe `OrderQueue` to `OrderTopic`

6. **Test Flow**
   - Publish test JSON message to `OrderTopic` SNS :

```json
{
  "orderId": "O1234",
  "userId": "U123",
  "itemName": "Laptop",
  "quantity": 1,
  "status": "new",
  "timestamp": "2025-05-03T12:00:00Z"
}

## 📊 Architecture Diagram

![Architecture Diagram](docs/architecture.png)
