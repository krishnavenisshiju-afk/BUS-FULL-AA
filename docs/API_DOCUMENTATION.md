# API Documentation - BUS-FULL-AA

Complete API reference for the BUS-FULL-AA backend server.

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Error Handling](#error-handling)
- [Examples](#examples)
- [Rate Limiting](#rate-limiting)

---

## Overview

### Base URL
```
http://localhost:5000
```

### Response Format
All responses are in JSON format (except the QR generation endpoint which returns HTML).

### Content-Type
```
application/json
```

### Server Information
- **Runtime:** Node.js
- **Framework:** Express.js
- **Port:** 5000
- **CORS:** Enabled

---

## Authentication

This API does not require authentication. All endpoints are publicly accessible.

**Note:** For production deployment, consider implementing:
- API Key authentication
- JWT tokens
- OAuth 2.0

---

## Endpoints

### 1. Health Check Endpoint

#### GET /

Check if the backend server is running.

**Request:**
```http
GET / HTTP/1.1
Host: localhost:5000
```

**Response:**
```
Status: 200 OK

Backend is working 🚀
```

**cURL Example:**
```bash
curl http://localhost:5000/
```

---

### 2. Search Buses by Route

#### GET /buses

Get all available buses for a specific route.

**Request:**
```http
GET /buses?from=ALUVA&to=VYTILA HTTP/1.1
Host: localhost:5000
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| from | string | Yes | Starting location (case-insensitive) |
| to | string | Yes | Destination location (case-insensitive) |

**Response (200 OK):**
```json
[
  {
    "id": "BUS1001",
    "from": "ALUVA",
    "to": "VYTILA",
    "arrivalTime": "10:15 AM",
    "passengers": 5
  },
  {
    "id": "BUS1003",
    "from": "ALUVA",
    "to": "VYTILA",
    "arrivalTime": "11:00 AM",
    "passengers": 12
  }
]
```

**Response (400 Bad Request):**
```json
{
  "message": "Enter from & to"
}
```

**cURL Example:**
```bash
curl "http://localhost:5000/buses?from=ALUVA&to=VYTILA"

# With URL encoding for spaces
curl "http://localhost:5000/buses?from=NEW%20YORK&to=LOS%20ANGELES"
```

**JavaScript Fetch Example:**
```javascript
const from = "ALUVA";
const to = "VYTILA";

fetch(`http://localhost:5000/buses?from=${from}&to=${to}`)
  .then(res => res.json())
  .then(buses => console.log(buses))
  .catch(err => console.error(err));
```

---

### 3. Get Single Bus Details

#### GET /bus/:id

Get details of a specific bus by ID.

**Request:**
```http
GET /bus/BUS1001 HTTP/1.1
Host: localhost:5000
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Bus ID (e.g., BUS1001) |

**Response (200 OK):**
```json
{
  "id": "BUS1001",
  "from": "ALUVA",
  "to": "VYTILA",
  "arrivalTime": "10:15 AM",
  "passengers": 5
}
```

**Response (404 Not Found):**
```json
{
  "message": "Bus not found"
}
```

**cURL Example:**
```bash
curl http://localhost:5000/bus/BUS1001
```

**JavaScript Fetch Example:**
```javascript
const busId = "BUS1001";

fetch(`http://localhost:5000/bus/${busId}`)
  .then(res => res.json())
  .then(bus => console.log(bus))
  .catch(err => console.error(err));
```

---

### 4. Scan QR Code (Check-in/Check-out)

#### POST /scan

Handle passenger check-in and check-out using QR code data.

**Request:**
```http
POST /scan HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "busId": "BUS1001",
  "userId": "USER1234567890"
}
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| busId | string | Yes | Bus identifier from QR code |
| userId | string | Yes | Unique user/device identifier |

**Response (200 OK) - First Scan (Check-in):**
```json
{
  "message": "Checked IN ✅",
  "passengers": 6
}
```

**Response (200 OK) - Second Scan (Check-out):**
```json
{
  "message": "Checked OUT ❌",
  "passengers": 5
}
```

**Response (404 Not Found):**
```json
{
  "message": "Bus not found"
}
```

**Behavior:**
- First scan → User marked as checked in, passenger count increases
- Second scan → User marked as checked out, passenger count decreases
- Prevents double check-in with same QR code

**cURL Example:**
```bash
curl -X POST http://localhost:5000/scan \
  -H "Content-Type: application/json" \
  -d '{
    "busId": "BUS1001",
    "userId": "USER123456"
  }'
```

**JavaScript Fetch Example:**
```javascript
const scanData = {
  busId: "BUS1001",
  userId: "USER123456"
};

fetch("http://localhost:5000/scan", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(scanData)
})
  .then(res => res.json())
  .then(data => {
    console.log(data.message);
    console.log(`Passengers: ${data.passengers}`);
  })
  .catch(err => console.error(err));
```

---

### 5. Generate QR Code

#### GET /generate-qr/:busId

Generate a QR code for a specific bus that can be scanned for check-in.

**Request:**
```http
GET /generate-qr/BUS1001 HTTP/1.1
Host: localhost:5000
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| busId | string | Bus ID to generate QR for |

**Response (200 OK) - HTML Page:**
```html
<h2>QR for BUS1001</h2>
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+" />
<p>Scan this in your scanner page</p>
```

**Response (200 OK) - Bus Not Found:**
```
Bus not found
```

**Response Format:**
- Returns HTML page with embedded QR code image
- QR code is in data URL format (base64 encoded PNG)
- Can be displayed in browser or extracted for further processing

**cURL Example:**
```bash
# Get QR code as HTML
curl http://localhost:5000/generate-qr/BUS1001 > qr_code.html

# Open in browser
curl http://localhost:5000/generate-qr/BUS1001 | firefox
```

**JavaScript Example:**
```javascript
const busId = "BUS1001";

fetch(`http://localhost:5000/generate-qr/${busId}`)
  .then(res => res.text())
  .then(html => {
    // Display in iframe or new window
    document.body.innerHTML += html;
  });
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Example Scenario |
|------|---------|------------------|
| 200 | OK | Successful request |
| 400 | Bad Request | Missing required parameters |
| 404 | Not Found | Bus ID doesn't exist |
| 500 | Server Error | Unexpected server error |

### Error Response Format

All error responses follow this format:
```json
{
  "message": "Description of what went wrong"
}
```

### Example Error Responses

**Missing Parameters:**
```json
{
  "message": "Enter from & to"
}
```

**Bus Not Found:**
```json
{
  "message": "Bus not found"
}
```

---

## Examples

### Complete Workflow Example

Here's a typical user journey with API calls:

#### Step 1: Search for buses
```bash
curl "http://localhost:5000/buses?from=ALUVA&to=VYTILA"
```
Returns: List of available buses

#### Step 2: Get QR code for a bus
```bash
curl http://localhost:5000/generate-qr/BUS1001
# Display QR code to user
```

#### Step 3: User scans QR code
```bash
curl -X POST http://localhost:5000/scan \
  -H "Content-Type: application/json" \
  -d '{"busId":"BUS1001","userId":"USER123456"}'
```
Returns: Check-in confirmation

#### Step 4: Check bus details
```bash
curl http://localhost:5000/bus/BUS1001
```
Returns: Updated bus info with new passenger count

---

## Rate Limiting

**Current Status:** Not implemented

**Recommended for Production:**
- Limit requests per IP address
- Implement exponential backoff for retries
- Rate limit: 100 requests per minute per IP
- Return 429 (Too Many Requests) when exceeded

---

## Data Models

### Bus Object
```json
{
  "id": "string",          // Unique identifier (e.g., "BUS1001")
  "from": "string",        // Origin city/location
  "to": "string",          // Destination city/location  
  "arrivalTime": "string", // Expected arrival time (e.g., "10:15 AM")
  "passengers": "number"   // Current passenger count
}
```

### Scan Request
```json
{
  "busId": "string",       // Bus identifier from QR code
  "userId": "string"       // User/device identifier
}
```

### Scan Response
```json
{
  "message": "string",     // Check-in/Check-out message
  "passengers": "number"   // Updated passenger count
}
```

---

## Testing the API

### Using Postman
1. Import the endpoints
2. Use the query parameters tool for GET requests
3. Use the Body tab for POST requests
4. Execute and view responses

### Using cURL
All examples provided above use cURL, which is available on all major operating systems.

### Using Browser DevTools
- Open Browser Console (F12)
- Use Fetch API examples provided above
- Monitor Network tab for requests/responses

---

## CORS (Cross-Origin Resource Sharing)

CORS is enabled on all endpoints, allowing requests from:
- Different domains
- Different ports (e.g., frontend on 3000, backend on 5000)
- Different subdomains

This allows the frontend to communicate with the backend without origin restrictions.

---

**Last Updated:** February 2026
