# 📧 Gmail Setup for GadgetMart Notification Service

## Step 1: Enable 2-Factor Authentication on your Gmail
Go to: https://myaccount.google.com/security → Enable 2-Step Verification

## Step 2: Generate a Google App Password
Go to: https://myaccount.google.com/apppasswords
- Select App: "Mail"
- Select Device: "Other" → enter "GadgetMart"
- Copy the 16-character password generated

## Step 3: Set environment variables (PowerShell)

```powershell
$env:GMAIL_USERNAME = "your-email@gmail.com"
$env:GMAIL_APP_PASSWORD = "xxxx xxxx xxxx xxxx"
```

## Step 4: Restart notification-service with ENV vars set

```powershell
$env:GMAIL_USERNAME = "your-email@gmail.com"
$env:GMAIL_APP_PASSWORD = "abcd efgh ijkl mnop"
.\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run -pl notification-service
```

## Step 5: Test the full Kafka → Email flow

### A. Test Order Confirmation Email (places order → Kafka → email)
```powershell
# Edit order_req.json to use YOUR email, then:
curl.exe -X POST -H "Content-Type: application/json" -d "@order_req.json" http://localhost:8080/api/orders
```

### B. Test OTP Email
```powershell
curl.exe -X POST "http://localhost:8080/api/auth/send-otp?email=YOUR@EMAIL.COM&purpose=LOGIN"
```

### C. Test Shipping Update Email
```powershell
curl.exe -X PATCH "http://localhost:8080/api/orders/ORDER_NUMBER_HERE/status?status=SHIPPED"
```
