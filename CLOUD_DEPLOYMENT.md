# ☁️ GadgetMart Cloud Deployment Guide

This guide will walk you through deploying your 8 microservices and frontend to the cloud.

## 1. Prepare Docker Images
Run the following script to build and push your images to Docker Hub:
```powershell
.\push_images.ps1 <YOUR_DOCKERHUB_USERNAME>
```

## 2. Cloud Database Setup (Already Configured)
Your services are already set up to use:
- **Supabase**: PostgreSQL
- **MongoDB Atlas**: NoSQL

## 3. Frontend Deployment (Vercel)
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and import the repository.
3. Add the following **Environment Variables**:
   - `NEXT_PUBLIC_API_BASE_URL`: The URL of your deployed API Gateway.
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`: `rzp_test_SIRwvdegQrkkCj`
   - `NEXT_PUBLIC_GEMINI_API_KEY`: `AIzaSyBO282Hyg4pysV3Kq88h5O-xilUJ6tU6nA`

### REQUIRED SECRETS (Render Project Settings):
Add these to your **Render** environment variables so things work:
- `APIFY_TOKEN`: (Your Apify Token)
- `UNSPLASH_ACCESS_KEY`: (Your Unsplash Access Key)
- `UNSPLASH_SECRET_KEY`: (Your Unsplash Secret Key)
- `RAZORPAY_KEY_ID`: `rzp_test_SIRwvdegQrkkCj`
- `RAZORPAY_KEY_SECRET`: `VH8XfojZ1pXjCS5gApaxOihk`
- `GMAIL_USERNAME`: `gadgetmart.77777@gmail.com`
- `GMAIL_APP_PASSWORD`: `dilh qufc vnbm ykui`
- `SPRING_DATASOURCE_PASSWORD`: `Indrakumar2005` (Supabase)

## 4. Backend Deployment (The $0 Path)

Since you need a **truly free** way to host 8 microservices, here are your best options:

### 🏆 Best Option: Oracle Cloud "Always Free"
- **Memory**: 24 GB RAM (This is huge! Enough for all 8 microservices).
- **CPU**: 4 ARM Cores.
- **Why**: It **never sleeps**. Your app will be fast 24/7.
- **Difficulty**: You need to sign up with a Credit/Debit card for verification ($0 charge), and setup is slightly technical (SSH).

### 🥈 Option 2: Render (Free Tier)
- **Why**: Extremely easy to use.
- **Catch**: It **sleeps** after 15 mins. Use **[cron-job.org](https://cron-job.org)** to ping your API Gateway URL every 10 minutes to keep it awake!

### 🥉 Option 3: Railway (Trial)
- **Why**: The best user experience.
- **Catch**: Only free for the first $5 or 30 days.

---

## 5. Security & Push Protection
If your push is blocked by GitHub, it's usually because it detected a secret. I have replaced all secrets with variables like `${APIFY_TOKEN}`. 

Make sure you add these variables in your **Render** and **Vercel** dashboards!
