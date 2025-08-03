# OrderStream

**OrderStream** is a real-time full-stack **Order Management System** designed to handle customer orders with AWS integrations and a complete CI/CD pipeline.

---

## 🚀 Project Overview

This project aims to build and deploy a scalable, modern Order Management System using:

- **Frontend**: React.js (with Tailwind CSS and ShadCN UI)
- **Backend**: Node.js (or Spring Boot)
- **Cloud Services**: AWS DynamoDB, S3, SNS
- **CI/CD Pipeline**: GitHub Actions / Jenkins

---

## 🎯 Objectives

- Create, store, and manage customer orders
- Upload and access invoices through S3
- Notify users via SNS on order creation
- Clean, responsive UI for interacting with orders
- End-to-end CI/CD for continuous deployment

---

## 🧱 Backend (Node.js / Spring Boot)

### 📦 Entities

- `Order`
  - `orderId` (UUID)
  - `customerName` (String)
  - `orderAmount` (Double)
  - `orderDate` (ISO Timestamp)
  - `invoiceFileUrl` (String, S3 URL)

### 📡 Endpoints

| Method | Endpoint        | Description                          |
|--------|------------------|--------------------------------------|
| POST   | `/orders`        | Create a new order (upload invoice to S3, send SNS) |
| GET    | `/orders/{id}`   | Fetch order by ID                    |
| GET    | `/orders`        | List all orders                      |

### ☁ AWS Integration

- **DynamoDB**: Store order data
- **S3**: Upload and retrieve invoice PDFs
- **SNS**: Send notifications on new order creation

---

## 🎨 Frontend (React.js)

### 📄 Pages

1. **Dashboard** (`/`)
   - List of all orders
   - Columns: Order ID, Customer Name, Amount, Date, Invoice Link

2. **Create Order** (`/create`)
   - Form to create a new order
   - Upload invoice (PDF)
   - POST to `/orders`

3. **Order Detail** (`/orders/:id`)
   - Detailed view of a single order
   - Download invoice button

### ✨ UI Features

- Responsive design
- Toast notifications
- Styled using Tailwind CSS and ShadCN UI

---

## 🔁 CI/CD Pipeline

### ✅ GitHub Actions

Example file: `.github/workflows/deploy.yml`

- Checkout repo
- Build with Maven or Node
- Run tests
- Deploy to AWS (Elastic Beanstalk / EC2 / ECS)

### ✅ Jenkins (Optional)

- Git clone + build
- Test and deploy via AWS CLI

---

## 📦 Project Structure

```
/
├── client/             # React frontend
├── server/             # Node.js or Spring Boot backend
├── .github/workflows/  # GitHub Actions config
├── shared/             # Common assets or interfaces
```

---

## 🧪 Optional Features

- [ ] JWT Authentication for order APIs
- [ ] Export order logs to S3 in JSON format
- [ ] Sales analytics chart on dashboard
- [ ] Swagger UI for API documentation

---

## 🛠️ How to Run Locally

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm start
```

> Make sure to set AWS credentials before running locally.

---

## 📌 Deliverables

- ✅ `/order-service` (Backend)
- ✅ `/order-ui` (Frontend)
- ✅ CI/CD setup (`GitHub Actions` or `Jenkins`)
- ✅ Swagger UI (if implemented)
- ✅ README with all setup and explanation

---

## 📝 Evaluation Criteria

| Criteria                                | Weight |
|-----------------------------------------|--------|
| Spring Boot API + AWS Integration       | 25%    |
| React.js Functionality + UI/UX          | 20%    |
| CI/CD Workflow                          | 20%    |
| Documentation & Code Quality            | 10%    |
| SNS Email Notification Setup            | 5%     |
| Deployment to Cloud VPS                 | 10%    |
| Bonus Tasks (JWT, Charts, Logs)         | 10%    |

---

## 💡 Contact

Made with 💻 by [Shreya](https://github.com/shreya-4567)

---
