# Localhost Execution Guide (Final) 🏠

The project is now fully configured and running on your machine. All database TimeZone issues have been resolved.

## 🚀 What is running right now?
1.  **Infrastructure**: Docker (Postgres, Mongo, Redis, Kafka, Elasticsearch).
2.  **Cluster**: Discovery, Gateway, User, Notification, Product, Search, Order, and Payment services.
3.  **Frontend**: Ready at [http://localhost:3000](http://localhost:3000)

## ✅ How to Verify
1.  Open your browser to [**http://localhost:3000**](http://localhost:3000).
2.  Try to sign in with your email.
3.  The **OTP** will now send correctly because the `user-service` is connected to the database!
4.  Visit [http://localhost:8761](http://localhost:8761) to see all your services in "UP" status.

## 🛠 For Future Restarts
If you ever restart your computer, use these exact commands to keep your system stable:

**1. Start Databases:**
`docker-compose up -d`

**2. Start Discovery & Gateway (Wait 10s between):**
`java -Xmx128m -jar discovery-service/target/discovery-service-1.0.0-SNAPSHOT.jar`
`java -Xmx256m -jar api-gateway/target/api-gateway-1.0.0-SNAPSHOT.jar`

**3. Start the Services (One by one):**
`java "-Duser.timezone=UTC" -Xmx256m -jar user-service/target/user-service-1.0.0-SNAPSHOT.jar`
`java "-Duser.timezone=UTC" -Xmx256m -jar product-service/target/product-service-1.0.0-SNAPSHOT.jar`
... (and so on)
