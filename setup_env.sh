#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# GadgetMart — Environment Setup Script for Azure VM
# Run this ONCE on your server to configure all required API keys.
# Then restart services with: docker compose -f docker-compose.prod.yml up -d
# ─────────────────────────────────────────────────────────────────────────────

echo "⚙️  Setting up GadgetMart environment variables..."

# ── STEP 1: Add secrets to /etc/environment (system-wide, persists reboots)
sudo tee -a /etc/environment > /dev/null << 'EOF'

# ── GadgetMart Secrets ──────────────────────────────────────────────────────
DB_PASSWORD=gm_password_2026
RAZORPAY_KEY_ID=YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
GEMINI_API_KEY=YOUR_GEMINI_KEY_HERE
EOF

echo ""
echo "✅ Environment variables written to /etc/environment"
echo ""
echo "⚠️  ACTION REQUIRED: Edit /etc/environment and replace the placeholder values:"
echo "    DB_PASSWORD       — your PostgreSQL password"
echo "    RAZORPAY_KEY_ID   — from https://dashboard.razorpay.com/app/keys"
echo "    RAZORPAY_KEY_SECRET — from https://dashboard.razorpay.com/app/keys"
echo "    GEMINI_API_KEY    — from https://aistudio.google.com/app/apikey"
echo ""
echo "    sudo nano /etc/environment"
echo ""
echo "── STEP 2: Reload environment and restart all services ───────────────────"
echo "    source /etc/environment"
echo "    docker compose -f docker-compose.prod.yml down"
echo "    docker compose -f docker-compose.prod.yml up -d"
echo ""
echo "🚀 Done! Visit http://\$(curl -s ifconfig.me):3000 once services are up."
