# GadgetMart Local Setup & Testing Guide

Follow these steps to run the complete microservices architecture and the revamped frontend on your local machine.

## 📋 Prerequisites
- **Docker Desktop** (running)
- **Java 17+**
- **Maven**
- **Node.js 18+**

---

## 🛠️ Step 1: Start Infrastructure
Run the following command in the **root directory** to start PostgreSQL, MongoDB, Redis, Kafka, and Elasticsearch:
```bash
docker-compose up -d
```
> [!IMPORTANT]
> Wait 1-2 minutes for all containers to be fully healthy before starting the Java services.

---

## ☕ Step 2: Build & Start Backend
1. **Build all modules**:
   ```bash
   mvn clean install -DskipTests
   ```

2. **Start Services in this exact order**:
   Wait for each to log "Started..." before moving to the next:
   - **Discovery Service**: `java -jar discovery-service/target/*.jar` (Port 8761)
   - **API Gateway**: `java -jar api-gateway/target/*.jar` (Port 8080)
   - **User Service**: `java -jar user-service/target/*.jar` (Auth/JWT)
   - **Product Service**: `java -jar product-service/target/*.jar` (Catalog/Seeding)
   - **Search Service**: `java -jar search-service/target/*.jar` (ES Integration)
   - **Notification Service**: `java -jar notification-service/target/*.jar` (Email/OTP)

---

## 🌐 Step 3: Run Frontend
Navigate to the `frontend` directory and start the development server:
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Testing the New Features

### 1. Test Login & OTP
- Go to `/login`.
- Enter your email.
- Check the console logs of **Notification Service** to see the 6-digit OTP (or check your email if SMTP is configured).
- Verify and ensure you see the "Elite Member" status in the header.

### 2. Test Catalog & Search
- On the Home page, scroll through the "New Launches" (60 items seeded).
- Use the Search Bar to find products like "iPhone 16" or "Galaxy S25".
- Verify that **Product Service** logs "Seeding completed" on first run.

### 3. Test Smart Cart
- Click "Add to Cart" on various product deals.
- Observe the **Floating Cart** counter update in the bottom right.
- Refresh the page and verify the items still exist (LocalStorage Sync).
- Go to `/cart` to adjust quantities and proceed to checkout.
