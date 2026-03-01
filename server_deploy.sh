# ─────────────────────────────────────────────────────────────────────────────
# GadgetMart — Server Deploy Script (runs on the Azure VM, not your laptop)
# Usage: bash server_deploy.sh YOUR_RAZORPAY_SECRET
# ─────────────────────────────────────────────────────────────────────────────

RAZORPAY_SECRET="${1}"
GEMINI_KEY="${2:-AIzaSyBO282Hyg4pysV3Kq887Y69q8-mksWc}"

if [ -z "$RAZORPAY_SECRET" ]; then
    echo "❌ Usage: bash server_deploy.sh YOUR_RAZORPAY_SECRET_KEY [YOUR_GEMINI_API_KEY]"
    echo "   Get secrets from: "
    echo "   1. Razorpay: https://dashboard.razorpay.com/app/keys"
    echo "   2. Gemini:   https://aistudio.google.com/app/apikey"
    exit 1
fi

echo "🚀 GadgetMart Deployment Starting..."

# ── 1. Pull latest code from GitHub ──────────────────────────────────────────
echo "⬇️  Pulling latest code from GitHub..."
cd ~/GadgetMart 2>/dev/null || (git clone https://github.com/INDRAKUMAR2005/GadgetMart.git ~/GadgetMart && cd ~/GadgetMart)
git pull origin main

# ── 2. Write the .env file with all needed secrets ───────────────────────────
echo "🔑 Writing production environment variables..."
cat > ~/GadgetMart/.env.prod << EOF
DB_PASSWORD=gm_password_2026
RAZORPAY_KEY_ID=rzp_live_SLViSJp7TtyeW0
RAZORPAY_KEY_SECRET=${RAZORPAY_SECRET}
GEMINI_API_KEY=${GEMINI_KEY}
APIFY_TOKEN=
UNSPLASH_ACCESS_KEY=
UNSPLASH_SECRET_KEY=
EOF
echo "✅ Environment file written."

# ── 3. Stop old containers ────────────────────────────────────────────────────
echo "🛑 Stopping old containers..."
cd ~/GadgetMart
docker-compose -f docker-compose.prod.yml --env-file .env.prod down 2>/dev/null || true

# ── 4. Build Java Microservices ───────────────────────────────────────────────
echo "☕ Compiling Java Microservices (This will take a few minutes)..."
./mvnw clean package -DskipTests

# ── 5. Start fresh ────────────────────────────────────────────────────────────
echo "🏗️  Rebuilding and starting all services..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

echo ""
echo "✅ All services started!"
echo ""
SERVER_IP=$(curl -s ifconfig.me)
echo "🌐 Storefront: http://${SERVER_IP}:3000"
echo "🔌 API Gateway: http://${SERVER_IP}:80"
echo "📡 Eureka Dashboard: http://${SERVER_IP}:8761"
echo ""
echo "⏳ Services take ~60 seconds to fully start. Tailing logs..."
sleep 10
docker-compose -f docker-compose.prod.yml logs --tail=20 payment-service frontend
