# GadgetMart Docker Push Script
# Usage: .\push_images.ps1 <your_dockerhub_username>

param (
    [Parameter(Mandatory=$true)]
    [string]$Username
)

$services = @(
    "discovery-service",
    "api-gateway",
    "user-service",
    "product-service",
    "search-service",
    "notification-service",
    "order-service",
    "payment-service"
)

Write-Host "🚀 Starting GadgetMart Cloud Build..." -ForegroundColor Cyan

foreach ($service in $services) {
    Write-Host "📦 Building $service..." -ForegroundColor Yellow
    docker build -t "$Username/gm-$service:latest" "./$service"
    
    Write-Host "📤 Pushing $service to Docker Hub..." -ForegroundColor Green
    docker push "$Username/gm-$service:latest"
}

Write-Host "✅ All services pushed successfully!" -ForegroundColor Cyan
