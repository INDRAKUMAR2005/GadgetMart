# Railway Deployment Guide for GadgetMart

This guide covers deploying all GadgetMart microservices to Railway.

## Prerequisites
- Sign up at https://railway.app using GitHub
- Connect your GitHub account

## Deployment Order (IMPORTANT - follow this order!)
1. discovery-service (must be first!)
2. api-gateway
3. user-service
4. product-service
5. order-service
6. payment-service
7. search-service
8. notification-service

## How to Deploy Each Service on Railway

### For Each Service:
1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select `INDRAKUMAR2005/GadgetMart`
4. Set the **Root Directory** to the service folder (e.g., `discovery-service`)
5. Railway will auto-detect the Dockerfile
6. Add the environment variables listed below
7. Click Deploy

---

## Environment Variables Per Service

### 1. discovery-service
```
SPRING_PROFILES_ACTIVE=prod
```

### 2. api-gateway
```
SPRING_PROFILES_ACTIVE=prod
EUREKA_SERVER_URL=<discovery-service Railway URL>/eureka/
```

### 3. user-service
```
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?sslmode=require
SPRING_DATASOURCE_USERNAME=postgres.mjywnglzjnrjfzodemwi
SPRING_DATASOURCE_PASSWORD=Indrakumar2005
JWT_SECRET=gadgetmart-super-secret-jwt-key-2026
EUREKA_SERVER_URL=<discovery-service Railway URL>/eureka/
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4. product-service
```
SPRING_PROFILES_ACTIVE=prod
SPRING_DATA_MONGODB_URI=mongodb+srv://gadgetmart77777_db_user:Indrakumar2005@gadgetmart1.yktdqzg.mongodb.net/gadgetmart_product?retryWrites=true&w=majority
EUREKA_SERVER_URL=<discovery-service Railway URL>/eureka/
```

### 5. order-service
```
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?sslmode=require
SPRING_DATASOURCE_USERNAME=postgres.mjywnglzjnrjfzodemwi
SPRING_DATASOURCE_PASSWORD=Indrakumar2005
EUREKA_SERVER_URL=<discovery-service Railway URL>/eureka/
```

### 6. payment-service
```
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?sslmode=require
SPRING_DATASOURCE_USERNAME=postgres.mjywnglzjnrjfzodemwi
SPRING_DATASOURCE_PASSWORD=Indrakumar2005
RAZORPAY_KEY_ID=rzp_test_SIRwvdegQrkkCj
RAZORPAY_KEY_SECRET=<your razorpay secret>
EUREKA_SERVER_URL=<discovery-service Railway URL>/eureka/
```

### 7. search-service
```
SPRING_PROFILES_ACTIVE=prod
EUREKA_SERVER_URL=<discovery-service Railway URL>/eureka/
```

### 8. notification-service
```
SPRING_PROFILES_ACTIVE=prod
EUREKA_SERVER_URL=<discovery-service Railway URL>/eureka/
SPRING_MAIL_USERNAME=<your gmail>
SPRING_MAIL_PASSWORD=<your gmail app password>
```
