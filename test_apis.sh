#!/bin/bash

# Base URL
BASE_URL="https://server.thanmaihomefoods.com/api"

# Colors for output
GREEN="\033[0;32m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo "Testing API endpoints..."
echo "========================"

# Test GET endpoints
echo -e "\n${GREEN}Testing GET endpoints:${NC}"

# Test categories
echo -e "\nTesting /categories"
curl -s -X GET "$BASE_URL/categories" | jq '.'

# Test products
echo -e "\nTesting /products"
curl -s -X GET "$BASE_URL/products" | jq '.'

# Test must-try products
echo -e "\nTesting /products?mustTry=true"
curl -s -X GET "$BASE_URL/products?mustTry=true" | jq '.'

# Test testimonials
echo -e "\nTesting /testimonials"
curl -s -X GET "$BASE_URL/testimonials" | jq '.'

# Test slider
echo -e "\nTesting /slider"
curl -s -X GET "$BASE_URL/slider" | jq '.'

# Test site settings
echo -e "\nTesting /site-settings"
curl -s -X GET "$BASE_URL/site-settings" | jq '.'

# Test orders
echo -e "\nTesting /orders"
curl -s -X GET "$BASE_URL/orders" \
  -H "Authorization: Bearer $(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' | jq -r '.token')" | jq '.'

# Test POST endpoints
echo -e "\n${GREEN}Testing POST endpoints:${NC}"

# Test login (with dummy credentials)
echo -e "\nTesting /auth/login"
curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' | jq '.'

# Test signup (with dummy credentials)
echo -e "\nTesting /auth/signup"
curl -s -X POST "$BASE_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}' | jq '.'

# Test forgot password
echo -e "\nTesting /auth/forgot-password"
curl -s -X POST "$BASE_URL/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}' | jq '.'

# Test bulk request
echo -e "\nTesting /bulk-requests"
curl -s -X POST "$BASE_URL/bulk-requests" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Company","email":"test@company.com","phone":"1234567890","company":"Test Corp","details":"Test bulk order"}' | jq '.'

# Test create order
echo -e "\nTesting /orders/create"
curl -s -X POST "$BASE_URL/orders/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' | jq -r '.token')" \
  -d '{
    "items": [
      {
        "product": "68360bfa0faba3f8d8e10528",
        "variant": "68360dc50faba3f8d8e106a4",
        "quantity": 1
      }
    ],
    "shipping": {
      "firstName": "Test",
      "lastName": "User",
      "address": "123 Test St",
      "city": "Test City",
      "state": "Test State",
      "zip": "123456",
      "phone": "1234567890",
      "country": "India"
    },
    "payment": {
      "method": "razorpay"
    }
  }' | jq '.'

# Test verify payment
echo -e "\nTesting /orders/verify-payment"
curl -s -X POST "$BASE_URL/orders/verify-payment" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' | jq -r '.token')" \
  -d '{
    "orderId": "test_order_id",
    "paymentId": "test_payment_id",
    "signature": "test_signature"
  }' | jq '.'

echo -e "\n${GREEN}API testing completed!${NC}" 