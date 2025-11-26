#!/bin/bash

# OrbIT Backend API Test Script
# This script tests all major endpoints

BASE_URL="http://localhost:5000/api"

echo "🧪 OrbIT Backend API Test Script"
echo "================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
HEALTH=$(curl -s ${BASE_URL}/health)
if [[ $HEALTH == *"OK"* ]]; then
  echo -e "${GREEN}✅ Server is running!${NC}"
  echo "$HEALTH" | jq '.'
else
  echo -e "${RED}❌ Server is not responding${NC}"
  exit 1
fi
echo ""

# Test 2: Register Mahasiswa
echo -e "${YELLOW}Test 2: Register Mahasiswa${NC}"
REGISTER_RESPONSE=$(curl -s -X POST ${BASE_URL}/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Mahasiswa",
    "email": "test.mahasiswa@student.its.ac.id",
    "password": "password123",
    "nrp": "5027231001",
    "primaryRole": "mahasiswa"
  }')

if [[ $REGISTER_RESPONSE == *"success\":true"* ]]; then
  echo -e "${GREEN}✅ Mahasiswa registered successfully!${NC}"
  MAHASISWA_TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token')
  echo "Token: ${MAHASISWA_TOKEN:0:50}..."
else
  echo -e "${YELLOW}⚠️  User might already exist, trying login...${NC}"
  # Try login instead
  LOGIN_RESPONSE=$(curl -s -X POST ${BASE_URL}/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test.mahasiswa@student.its.ac.id",
      "password": "password123"
    }')
  MAHASISWA_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
  echo "Token: ${MAHASISWA_TOKEN:0:50}..."
fi
echo ""

# Test 3: Register Dosen
echo -e "${YELLOW}Test 3: Register Dosen${NC}"
DOSEN_RESPONSE=$(curl -s -X POST ${BASE_URL}/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Dr. Test Dosen",
    "email": "test.dosen@lecturer.its.ac.id",
    "password": "password123",
    "primaryRole": "dosen"
  }')

if [[ $DOSEN_RESPONSE == *"success\":true"* ]]; then
  echo -e "${GREEN}✅ Dosen registered successfully!${NC}"
  DOSEN_TOKEN=$(echo $DOSEN_RESPONSE | jq -r '.token')
else
  echo -e "${YELLOW}⚠️  User might already exist, trying login...${NC}"
  LOGIN_RESPONSE=$(curl -s -X POST ${BASE_URL}/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test.dosen@lecturer.its.ac.id",
      "password": "password123"
    }')
  DOSEN_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
fi
echo ""

# Test 4: Get Current User (Mahasiswa)
echo -e "${YELLOW}Test 4: Get Current User (Protected Route)${NC}"
ME_RESPONSE=$(curl -s ${BASE_URL}/auth/me \
  -H "Authorization: Bearer $MAHASISWA_TOKEN")

if [[ $ME_RESPONSE == *"success\":true"* ]]; then
  echo -e "${GREEN}✅ Protected route works!${NC}"
  echo "$ME_RESPONSE" | jq '.user | {fullName, email, primaryRole}'
else
  echo -e "${RED}❌ Protected route failed${NC}"
fi
echo ""

# Test 5: Create Announcement (Dosen)
echo -e "${YELLOW}Test 5: Create Announcement (Dosen)${NC}"
ANNOUNCEMENT_RESPONSE=$(curl -s -X POST ${BASE_URL}/announcements \
  -H "Authorization: Bearer $DOSEN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Announcement - API Test",
    "description": "This is a test announcement created by automated script",
    "category": "academic",
    "priority": "normal",
    "targetRoles": ["mahasiswa"],
    "startDate": "2024-11-26",
    "endDate": "2024-12-31"
  }')

if [[ $ANNOUNCEMENT_RESPONSE == *"success\":true"* ]]; then
  echo -e "${GREEN}✅ Announcement created!${NC}"
  ANNOUNCEMENT_ID=$(echo $ANNOUNCEMENT_RESPONSE | jq -r '.data._id')
  echo "Announcement ID: $ANNOUNCEMENT_ID"
else
  echo -e "${RED}❌ Failed to create announcement${NC}"
  echo "$ANNOUNCEMENT_RESPONSE" | jq '.'
fi
echo ""

# Test 6: Get All Announcements (Mahasiswa)
echo -e "${YELLOW}Test 6: Get All Announcements${NC}"
ANNOUNCEMENTS=$(curl -s ${BASE_URL}/announcements \
  -H "Authorization: Bearer $MAHASISWA_TOKEN")

if [[ $ANNOUNCEMENTS == *"success\":true"* ]]; then
  echo -e "${GREEN}✅ Announcements retrieved!${NC}"
  ANNOUNCEMENT_COUNT=$(echo $ANNOUNCEMENTS | jq '.count')
  echo "Total announcements: $ANNOUNCEMENT_COUNT"
else
  echo -e "${RED}❌ Failed to get announcements${NC}"
fi
echo ""

# Test 7: Mahasiswa tries to create announcement (should fail)
echo -e "${YELLOW}Test 7: Authorization Test (Mahasiswa creating announcement - should fail)${NC}"
FORBIDDEN=$(curl -s -X POST ${BASE_URL}/announcements \
  -H "Authorization: Bearer $MAHASISWA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "description": "Test",
    "category": "academic",
    "priority": "normal",
    "targetRoles": ["mahasiswa"],
    "startDate": "2024-11-26"
  }')

if [[ $FORBIDDEN == *"403"* ]] || [[ $FORBIDDEN == *"not authorized"* ]]; then
  echo -e "${GREEN}✅ Authorization working correctly! (Mahasiswa blocked from creating announcements)${NC}"
else
  echo -e "${RED}❌ Authorization not working properly${NC}"
fi
echo ""

# Summary
echo "================================="
echo -e "${GREEN}🎉 Backend API Tests Complete!${NC}"
echo ""
echo "Tokens saved (use these for manual testing):"
echo "Mahasiswa Token: $MAHASISWA_TOKEN"
echo "Dosen Token: $DOSEN_TOKEN"
echo ""
echo "Next steps:"
echo "1. Use Thunder Client/Postman for more detailed testing"
echo "2. Test file upload for announcements"
echo "3. Test booking system with classrooms"
echo "4. Check MongoDB Compass to see created data"
