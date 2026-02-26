# ☁️ GadgetMart Cloud Deployment Guide (Railway Updated)

This project is now fully configured for a stable, high-performance deployment on **Railway**.

## 1. Backend Architecture (Railway) 🏆
All 8 microservices are now standardized with:
- **Internal Networking**: Services communicate via `.railway.internal` hostnames (0 latency, high security).
- **Dockerized Builds**: Custom `railway.json` files ensure Railway uses the root context for perfect builds.

### REQUIRED SECRETS (Railway Project Settings):
Add these to your **Railway shared variables** or individual service settings:
- `APIFY_TOKEN`: (Your Apify Token)
- `UNSPLASH_ACCESS_KEY`: (Your Unsplash Access Key)
- `UNSPLASH_SECRET_KEY`: (Your Unsplash Secret Key)
- `RAZORPAY_KEY_ID`: `rzp_test_SIRwvdegQrkkCj`
- `RAZORPAY_KEY_SECRET`: `VH8XfojZ1pXjCS5gApaxOihk`
- `GMAIL_USERNAME`: `gadgetmart.77777@gmail.com`
- `GMAIL_APP_PASSWORD`: `dilh qufc vnbm ykui`
- `SPRING_DATASOURCE_PASSWORD`: `Indrakumar2005` (Supabase)

## 2. Frontend Deployment (Vercel)
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and import the repository.
3. Add the following **Environment Variables**:
   - `NEXT_PUBLIC_API_BASE_URL`: Use your **API Gateway** public URL from Railway.
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`: `rzp_test_SIRwvdegQrkkCj`
   - `NEXT_PUBLIC_GEMINI_API_KEY`: `AIzaSyBO282Hyg4pysV3Kq88h5O-xilUJ6tU6nA`

## 3. How to Trigger Deployment
Since a platform limitation prevents me from clicking "Deploy" for you:
1. **Push to GitHub**: Commit these changes (`git commit -m "Standardize cloud configs"`) and push.
2. **Railway Dashboard**: Go to your project and click **Deploy** or **Redeploy** on the services.
3. **Verify**: Check [Eureka Dashboard](https://discovery-service-production-49c1.up.railway.app/) to see 7 instances "UP".

---

## 4. Alternate Hosting Options ($0)
- **Oracle Cloud "Always Free"**: Best for 24/7 uptime without trial limits. (24 GB RAM).
- **Render (Free Tier)**: Good but sleeps after 15 mins. (Use cron-job.org).
