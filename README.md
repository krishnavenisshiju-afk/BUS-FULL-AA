# 🚌 BUS-FULL-AA - Smart Bus Ticketing & QR Scanning System

A modern web-based bus ticketing system with real-time QR code scanning for passenger check-in and check-out management.

## 📋 Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Demo Video](#demo-video)
- [Team Members](#team-members)
- [License](#license)

---

## 📖 Project Description

BUS-FULL-AA is a comprehensive bus management system designed to streamline passenger tracking and ticketing. The system uses QR code technology to enable efficient check-in and check-out processes, allowing real-time monitoring of passenger counts on each bus. The application consists of a responsive frontend for searching buses and scanning QR codes, paired with a robust Express.js backend API for bus and passenger management.

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Styling with gradients and animations
- **Vanilla JavaScript (ES6+)** - DOM manipulation and browser APIs
- **HTML5 QRCode Library** - QR code scanning functionality
- **localStorage** - Client-side data persistence

### Backend
- **Node.js** - JavaScript runtime
- **Express.js (v5.2.1+)** - Web framework
- **CORS (v2.8.6+)** - Cross-Origin Resource Sharing
- **QRCode (v1.5.4+)** - QR code generation
- **OS module** - Network interface detection

### Tools & Deployment
- **npm** - Package management
- **Git** - Version control
- **REST API** - Standard HTTP endpoints

---

## ✨ Features

1. **Bus Search & Filtering**
   - Search buses by origin and destination
   - Real-time filtering of available routes
   - Display detailed bus information (ID, route, arrival time, passenger count)

2. **QR Code Generation**
   - Dynamic QR code generation for each bus
   - Server-side QR generation with data URL format
   - Scannable QR codes for passenger boarding

3. **Real-time QR Scanning**
   - HTML5-based camera access for QR scanning
   - Automatic check-in/check-out confirmation
   - User-specific device tracking using localStorage
   - Visual feedback (✅ Check-in / ❌ Check-out)

4. **Passenger Management**
   - Real-time passenger count tracking
   - Duplicate entry prevention
   - Check-out functionality to manage occupancy

5. **Cross-Device Compatibility**
   - Responsive design for desktop and mobile
   - Network-reachable server (not just localhost)
   - Modern browser support

---

## 📦 Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **Git**

### Clone the Repository

```bash
git clone https://github.com/krishnavenisshiju-afk/BUS-FULL-AA.git
cd BUS-FULL-AA-1
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Frontend Dependencies (if any build tools needed)

```bash
cd ../BUS-FULL-AA
# Frontend runs in the browser directly (no build step required)
```

### Project Structure After Installation

```
BUS-FULL-AA-1/
├── backend/                  # Express.js server
│   ├── server.js            # Main API server
│   ├── package.json
│   └── node_modules/
├── BUS-FULL-AA/             # Frontend application
│   ├── index.html           # Landing page
│   ├── details.html         # Bus search results
│   ├── scanner.html         # QR scanning page
│   ├── test-qr.html         # QR testing page
│   ├── public/              # Static assets
│   └── src/
│       ├── main.js          # Search page logic
│       ├── details.js       # Details page logic
│       ├── counter.js       # Counter component
│       └── style.css        # Global styles
├── docs/                    # Documentation
├── package.json
├── README.md
├── LICENSE
└── .gitignore
```

---

## 🚀 Running the Project

### Start Backend Server

```bash
cd backend
node server.js
```

Expected output:
```
✅ Backend running at:
  - Local: http://localhost:5000
  - Network: http://192.168.x.x:5000  (Replace with your IP)
```

### Access Frontend

1. **Local testing:**
   ```bash
   # Open in browser
   http://localhost:5000/BUS-FULL-AA/index.html
   # Or serve with Live Server extension in VS Code
   ```

2. **Network access (for mobile testing):**
   - Replace `localhost` with your machine's IP address (shown in backend output)
   - Example: `http://192.168.x.x:5000`

### Environment Setup

No additional `.env` file needed. The server auto-detects the local network IP and runs on port 5000.

---

## 🏗️ Architecture

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed:
- System architecture diagrams
- Data flow diagrams
- Request/response flows
- Deployment recommendations
- Security considerations

**Quick Overview:**
- Frontend communicates with backend via REST API
- Backend manages buses and passenger scanning
- In-memory data storage (can be extended to database)
- CORS enabled for cross-origin requests

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### 1. Health Check
```
GET /
```
**Response:** `Backend is working 🚀`

---

#### 2. Get Available Buses
```
GET /buses?from=ALUVA&to=VYTILA
```

**Query Parameters:**
- `from` (string, required) - Starting location
- `to` (string, required) - Destination

**Response (200):**
```json
[
  {
    "id": "BUS1001",
    "from": "ALUVA",
    "to": "VYTILA",
    "arrivalTime": "10:15 AM",
    "passengers": 5
  }
]
```

**Error Response (400):**
```json
{
  "message": "Enter from & to"
}
```

---

#### 3. Get Single Bus
```
GET /bus/:id
```

**Parameters:**
- `id` (string, required) - Bus ID (e.g., BUS1001)

**Response (200):**
```json
{
  "id": "BUS1001",
  "from": "ALUVA",
  "to": "VYTILA",
  "arrivalTime": "10:15 AM",
  "passengers": 5
}
```

**Error Response (404):**
```json
{
  "message": "Bus not found"
}
```

---

#### 4. Scan QR / Check In/Out
```
POST /scan
```

**Request Body:**
```json
{
  "busId": "BUS1001",
  "userId": "USER1234567890"
}
```

**Response (200) - First Scan (Check-in):**
```json
{
  "message": "Checked IN ✅",
  "passengers": 6
}
```

**Response (200) - Second Scan (Check-out):**
```json
{
  "message": "Checked OUT ❌",
  "passengers": 5
}
```

**Error Response (404):**
```json
{
  "message": "Bus not found"
}
```

---

#### 5. Generate QR Code
```
GET /generate-qr/:busId
```

**Parameters:**
- `busId` (string, required) - Bus ID (e.g., BUS1001)

**Response (200):**
```html
<h2>QR for BUS1001</h2>
<img src="data:image/png;base64,..." />
<p>Scan this in your scanner page</p>
```

**Response (200) - Bus Not Found:**
```
Bus not found
```

---

### Sample API Calls

**Using curl:**
```bash
# Search buses
curl "http://localhost:5000/buses?from=ALUVA&to=VYTILA"

# Scan QR
curl -X POST http://localhost:5000/scan \
  -H "Content-Type: application/json" \
  -d '{"busId":"BUS1001","userId":"USER123456"}'

# Get QR
curl http://localhost:5000/generate-qr/BUS1001
```

---

## 📸 Screenshots

### 1. Landing Page - Bus Search
```

```
- Users enter origin and destination
- Two-button interface for searching or scanning
- Modern gradient background

### 2. Bus Details Page
```
┌─────────────────────────────┐
│    🚌 BUS FULL-AA           │
├─────────────────────────────┤
│   Available Buses            │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ 🚌 BUS1001              │ │
│ │ 🛣 ALUVA ➝ VYTILA       │ │
│ │ ⏱ 10:15 AM              │ │
│ │ 👥 5 passengers         │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 🚌 BUS1002              │ │
│ │ 🛣 ERNAKULAM ➝ POOKATUPADY │
│ │ ⏱ 10:45 AM              │ │
│ │ 👥 3 passengers         │ │
│ └─────────────────────────┘ │
│          [⬅ Back]            │
└─────────────────────────────┘
```
- Displays filtered buses matching user's route
- Shows real-time passenger count
- Clean card-based layout

### 3. QR Scanner Page
```
┌──────────────────────────┐
│  🚌 Bus QR Scanner       │
├──────────────────────────┤
│  ┌────────────────────┐  │
│  │  [CAMERA FEED]     │  │
│  │   (scanning...)    │  │
│  └────────────────────┘  │
│                          │
│  [📱 Start] [⛔ Stop]    │
│                          │
│  Ready to scan...        │
│                          │
│  ┌────────────────────┐  │
│  │ Checked IN ✅      │  │
│  │ Passengers: 6      │  │
│  └────────────────────┘  │
└──────────────────────────┘
```
- Real-time camera feed
- Displays scan results immediately
- Shows passenger count updates

---

## 🎥 Demo Video

Demo video link to be added after recording. The video will showcase:
- Bus search functionality
- QR code generation
- Real-time scanning and passenger count updates
- Check-in/check-out workflow

---

## 👥 Team Members

| Name | Role | GitHub |
|------|------|--------|
| krishnavenisshiju-afk | Full Stack Developer | [@krishnavenisshiju-afk](https://github.com/krishnavenisshiju-afk) |

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### License Summary
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ⚠️ Liability limited
- ⚠️ Warranty not provided

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on [GitHub Issues](https://github.com/krishnavenisshiju-afk/BUS-FULL-AA/issues)

---

**Made with ❤️ by the BUS-FULL-AA Team**