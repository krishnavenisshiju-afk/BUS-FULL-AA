# Architecture Diagram - BUS-FULL-AA System

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT TIER                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Web Browser (Desktop/Mobile)                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                                                              │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │  │
│  │  │ index.html   │  │details.html  │  │ scanner.html     │  │  │
│  │  │              │  │              │  │                  │  │  │
│  │  │ • Search Box │  │ • Bus List   │  │ • Camera Access  │  │  │
│  │  │ • Navigation │  │ • Filters    │  │ • QR Reader      │  │  │
│  │  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │  │
│  │         │                 │                   │             │  │
│  │         └─────────────────┼───────────────────┘             │  │
│  │                           │                                 │  │
│  │         ┌─────────────────┴──────────────────┐              │  │
│  │         │   JavaScript Application Layer     │              │  │
│  │         ├──────────────────────────────────────┤             │  │
│  │         │ • main.js      - Search logic       │             │  │
│  │         │ • details.js   - Bus display logic  │             │  │
│  │         │ • counter.js   - UI components      │             │  │
│  │         │ • style.css    - UI styling         │             │  │
│  │         │ • html5-qrcode - QR scanning lib    │             │  │
│  │         └─────────────────┬──────────────────┘              │  │
│  │                           │                                 │  │
│  │         ┌─────────────────┴──────────────────┐              │  │
│  │         │     localStorage                   │              │  │
│  │         │  • userId (device identifier)      │              │  │
│  │         └──────────────────────────────────────┘             │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
                   ┌───────────┼───────────┐
                   │                       │
            HTTP/REST (CORS)         WebSocket (Future)
                   │
┌──────────────────▼────────────────────────────────────────────────┐
│                      SERVER TIER                                   │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Node.js Runtime Environment                                       │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                                                              │ │
│  │         Express.js HTTP Server (Port: 5000)                │ │
│  │  ┌────────────────────────────────────────────────────────┐ │ │
│  │  │                  Route Handlers                        │ │ │
│  │  ├────────────────────────────────────────────────────────┤ │ │
│  │  │                                                        │ │ │
│  │  │  GET /               • Health check                   │ │ │
│  │  │  GET /buses          • Filter buses by route          │ │ │
│  │  │  GET /bus/:id        • Get single bus details         │ │ │
│  │  │  GET /generate-qr/:busId  • Generate QR codes         │ │ │
│  │  │  POST /scan          • Handle check-in/out            │ │ │
│  │  │                                                        │ │ │
│  │  └────────────────────────────────────────────────────────┘ │ │
│  │                           │                                 │ │
│  │         ┌─────────────────┴────────────────┐               │ │
│  │         │  Core Modules                    │               │ │
│  │         ├────────────────────────────────────┤             │ │
│  │         │ • CORS - Cross-origin requests    │             │ │
│  │         │ • Express Router - Request routing│             │ │
│  │         │ • QRCode - QR generation          │             │ │
│  │         │ • OS Module - Network detection   │             │ │
│  │         └─────────────────┬────────────────┘              │ │
│  │                           │                                │ │
│  │         ┌─────────────────┴────────────────┐               │ │
│  │         │  In-Memory Data Layer            │               │ │
│  │         ├────────────────────────────────────┤             │ │
│  │         │                                  │               │ │
│  │         │  buses = [                       │               │ │
│  │         │    {                             │               │ │
│  │         │      id: "BUS1001",              │               │ │
│  │         │      from: "ALUVA",              │               │ │
│  │         │      to: "VYTILA",               │               │ │
│  │         │      arrivalTime: "10:15 AM",    │               │ │
│  │         │      passengers: 5               │               │ │
│  │         │    },                            │               │ │
│  │         │    ...                           │               │ │
│  │         │  ]                               │               │ │
│  │         │                                  │               │ │
│  │         │  scanLog = {                     │               │ │
│  │         │    "USER123": {                  │               │ │
│  │         │      "BUS1001": true,            │               │ │
│  │         │      "BUS1002": false            │               │ │
│  │         │    }                             │               │ │
│  │         │  }                               │               │ │
│  │         │                                  │               │ │
│  │         └──────────────────────────────────┘              │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Models

### Bus Object
```javascript
{
  id: String,              // Unique bus identifier (e.g., "BUS1001")
  from: String,           // Starting location
  to: String,             // Destination
  arrivalTime: String,    // Expected arrival time (e.g., "10:15 AM")
  passengers: Number      // Current passenger count
}
```

### Scan Log Object
```javascript
{
  "USER_ID": {
    "BUS_ID_1": Boolean,   // true = checked in, false = checked out
    "BUS_ID_2": Boolean,
    ...
  },
  ...
}
```

---

## Request/Response Flow Diagrams

### 1. Bus Search Flow
```
┌──────────────┐
│   User       │
└──────┬───────┘
       │ Enter from & to locations
       ▼
┌──────────────────┐
│  Frontend        │
└──────┬───────────┘
       │ GET /buses?from=ALUVA&to=VYTILA
       ▼
┌──────────────────┐
│  Backend         │
│  • Filter buses  │
│  • Validate      │
└──────┬───────────┘
       │ JSON Response [bus1, bus2, ...]
       ▼
┌──────────────────┐
│  Frontend        │
│  • Display cards │
│  • Show details  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  User sees       │
│  bus options     │
└──────────────────┘
```

### 2. QR Scanning Flow
```
┌──────────────┐
│   User       │
└──────┬───────┘
       │ Open scanner page
       ▼
┌──────────────────┐
│  Frontend        │
│  • Request       │
│    camera access │
└──────┬───────────┘
       │ User grants permission
       ▼
┌──────────────────┐
│  Camera Feed     │
│  (html5-qrcode)  │
└──────┬───────────┘
       │ User scans QR code
       ▼
┌──────────────────┐
│  Frontend        │
│  • Extract       │
│    busId from QR │
│  • Get userId    │
│    from storage  │
└──────┬───────────┘
       │ POST /scan {busId, userId}
       ▼
┌──────────────────┐
│  Backend         │
│  • Find bus      │
│  • Check scan    │
│    history       │
│  • Update counts │
└──────┬───────────┘
       │ Response {message, passengers}
       ▼
┌──────────────────┐
│  Frontend        │
│  • Show result   │
│    (✅/❌)       │
│  • Update count  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  User sees       │
│  confirmation &  │
│  passenger count │
└──────────────────┘
```

---

## Technology Stack Visualization

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT SIDE                          │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│ │ HTML5    │  │ CSS3     │  │ JavaScript│              │
│ │ (Markup) │  │ (Styling)│  │ (Logic)   │              │
│ └──────────┘  └──────────┘  └──────────┘              │
│        │             │              │                   │
│        └─────────────┼──────────────┘                   │
│                      │                                   │
│        ┌─────────────┴──────────────┐                   │
│        │                            │                   │
│   ┌────▼─────┐          ┌──────────▼────┐              │
│   │html5-    │          │localStorage    │              │
│   │qrcode    │          │(User Data)     │              │
│   └──────────┘          └────────────────┘              │
└─────────────────────────────────────────────────────────┘
          │
          │ HTTP/REST
          │
┌─────────▼─────────────────────────────────────────────┐
│                    SERVER SIDE                        │
│ ┌──────────────────────────────────────────────────┐ │
│ │                 Node.js                          │ │
│ └──────────────────────────────────────────────────┘ │
│              │                                        │
│        ┌─────┴──────────────────────────────┐        │
│        │                                    │        │
│   ┌────▼─────────┐     ┌────────────────┐  │        │
│   │  Express.js  │     │  npm Packages  │  │        │
│   │              │     │  • CORS        │  │        │
│   │ (Framework)  │     │  • QRCode      │  │        │
│   │              │     │  • OS module   │  │        │
│   └──────────────┘     └────────────────┘  │        │
│                                             │        │
│   ┌──────────────────────────────────────┐ │        │
│   │   In-Memory Database                 │ │        │
│   │   (buses[], scanLog)                 │ │        │
│   └──────────────────────────────────────┘ │        │
│                                             │        │
│   ┌──────────────────────────────────────┐ │        │
│   │   API Routes                         │ │        │
│   │   (5 endpoints)                      │ │        │
│   └──────────────────────────────────────┘ │        │
│                                             │        │
└─────────────────────────────────────────────────────┘
```

---

## Deployment Architecture (Recommended)

```
┌──────────────────────────────────────────────────┐
│          Cloud Server (e.g., AWS/Heroku)         │
├──────────────────────────────────────────────────┤
│                                                   │
│  ┌────────────────────────────────────────────┐  │
│  │  Node.js Application                       │  │
│  │  • Express Server                          │  │
│  │  • Port 5000 (internal)                    │  │
│  └────────────────────────────────────────────┘  │
│         │                                         │
│  ┌──────▼───────────────────────────────────┐   │
│  │  Nginx/Apache (Reverse Proxy)            │   │
│  │  • Port 80 (HTTP) → auto-redirect /:HTTPS│   │
│  │  • Port 443 (HTTPS)                      │   │
│  │  • SSL/TLS Certificate                   │   │
│  └──────┬───────────────────────────────────┘   │
│         │                                        │
│         ▼                                        │
│  [Internet] ◄─────────────────────────────┐    │
│                                           │     │
│  ┌──────────────────────────────────────────┐  │
│  │  Static Files (Frontend)                 │  │
│  │  • index.html                           │  │
│  │  • CSS/JS files                         │  │
│  │  • Served via CDN (optional)            │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Security Considerations

```
┌─────────────────────────────────────────────────┐
│           Security Layers                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. HTTPS/TLS Encryption                       │
│     └─ Encrypts data in transit                │
│                                                 │
│  2. CORS (Cross-Origin Resource Sharing)       │
│     └─ Controls API access                     │
│                                                 │
│  3. Input Validation                           │
│     └─ Validates from & to parameters          │
│                                                 │
│  4. Device Identification                      │
│     └─ localStorage for user tracking          │
│                                                 │
│  5. Rate Limiting (Recommended)                │
│     └─ Prevent abuse of API endpoints          │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

**Diagram Last Updated:** February 2026
