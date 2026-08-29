# 🖥️ Cyber Cafe Management System

A full-stack **MERN-based Cyber Cafe Management System** designed to manage customers, computer terminals, sessions, printing/Xerox services, and final billing through a simple web interface.

## 🌐 Live Demo

**Frontend:**
https://cyber-cafe-management-system-swart.vercel.app/

**GitHub Repository:**
https://github.com/mukeshmandala123/cyber-cafe-management-system

> **Note:** The frontend is deployed on Vercel. The backend requires deployment separately for the complete application to work publicly.

---

## 📌 Project Overview

The Cyber Cafe Management System helps cyber cafe administrators manage daily cafe operations from one centralized application.

The system allows administrators to:

* Manage customers
* Manage computer terminals
* Start and stop computer sessions
* Automatically calculate session charges
* Manage printing and Xerox services
* Record service usage
* Calculate service charges
* Generate final customer invoices
* Print invoices
* Monitor cafe activity through a dashboard

---

## ✨ Features

### 📊 Dashboard

The dashboard provides an overview of the cyber cafe:

* Total Customers
* Total Terminals
* Available Terminals
* Active Sessions
* Live backend data
* Quick navigation to major modules

### 👥 Customer Management

Administrators can:

* Add new customers
* View customer information
* Store customer name and phone number
* Use customer records for sessions and billing

### 💻 Terminal Management

The system supports computer terminal management.

Features include:

* Add terminals
* Terminal numbers
* Terminal types
* Terminal availability
* Occupied/available status
* Real-time terminal tracking

### ⏱️ Session Management

Administrators can:

* Select a customer
* Select an available terminal
* Start a session
* Stop an active session
* Calculate session duration
* Automatically calculate session charges
* View active sessions
* View session history

### 🖨️ Services Management

The system supports:

* Plain Printer
* Colour Printer
* Xerox

Each service contains:

* Service name
* Service type
* Rate per page
* Availability status

### 📄 Service Usage

Administrators can record:

* Customer
* Service
* Number of pages
* Rate per page
* Total amount
* Usage date

The total amount is calculated automatically.

### 🧾 Final Billing

The billing module combines:

**Computer session charges + Printing/Xerox charges = Final Invoice**

The invoice contains:

* Customer information
* Phone number
* Session history
* Service usage
* Session total
* Service total
* Grand total
* Payment status
* Invoice date
* Printable invoice

---

## 💰 Example Billing

Example customer invoice:

```text
Computer Sessions       ₹1.67
Services                ₹54.00
--------------------------------
Grand Total             ₹55.67
```

### Service calculation

```text
Xerox
2 pages × ₹2 = ₹4

Colour Printer
5 pages × ₹10 = ₹50

Service Total = ₹54
```

---

## 🔄 Application Workflow

```text
             Customer
                │
                ▼
       Terminal Management
                │
                ▼
        Start Computer Session
                │
                ▼
          Use Computer
                │
                ▼
          Stop Session
                │
                ▼
       Automatic Session Bill
                │
                ▼
       Printing / Xerox Usage
                │
                ▼
        Service Bill
                │
                ▼
          Final Billing
                │
                ▼
         Printable Invoice
```

---

## 🛠️ Technology Stack

### Frontend

* React.js
* React Router
* Bootstrap
* CSS
* Vite
* JavaScript

### Backend

* Node.js
* Express.js
* REST API
* Nodemon

### Database

* MongoDB
* MongoDB Atlas
* Mongoose

### Development Tools

* Visual Studio Code
* Git
* GitHub
* PowerShell

### Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database

---

## 📁 Project Structure

```text
cyber-cafe-management-system/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   │   ├── Billing.jsx
│   │   │   ├── Customers.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Sessions.jsx
│   │   │   └── Terminals.jsx
│   │   │
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── customerController.js
│   │   ├── dashboardController.js
│   │   ├── serviceController.js
│   │   ├── serviceUsageController.js
│   │   ├── sessionController.js
│   │   └── terminalController.js
│   │
│   ├── models/
│   │   ├── Customer.js
│   │   ├── Service.js
│   │   ├── ServiceUsage.js
│   │   ├── Session.js
│   │   └── Terminal.js
│   │
│   ├── routes/
│   │   ├── customerRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── serviceUsageRoutes.js
│   │   ├── sessionRoutes.js
│   │   └── terminalRoutes.js
│   │
│   ├── package.json
│   └── server.js
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/mukeshmandala123/cyber-cafe-management-system.git
```

### 2. Open the project

```bash
cd cyber-cafe-management-system
```

---

## 🚀 Backend Setup

Open a terminal:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

## 🎨 Frontend Setup

Open another terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🔐 Environment Variables

The backend uses environment variables for configuration.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

**Never upload `.env` to GitHub.**

The project `.gitignore` excludes environment files and `node_modules`.

---

## 🗄️ Database

The application uses **MongoDB Atlas** with Mongoose.

Main database models:

```text
Customer
Terminal
Session
Service
ServiceUsage
```

Relationships include:

```text
Customer
   │
   ├── Sessions
   │
   └── Service Usage

Terminal
   │
   └── Sessions

Service
   │
   └── Service Usage
```

---

## 🔌 Main API Modules

The Express backend provides REST API routes for:

```text
/api/customers
/api/terminals
/api/sessions
/api/services
/api/service-usage
/api/dashboard
```

These APIs are consumed by the React frontend.

---

## 📱 Application Pages

| Page      | Purpose                         |
| --------- | ------------------------------- |
| Dashboard | Overall cafe statistics         |
| Customers | Customer management             |
| Terminals | Computer terminal management    |
| Sessions  | Start, stop and manage sessions |
| Services  | Printer and Xerox management    |
| Billing   | Generate final invoices         |

---

## 📈 Current Project Status

| Module                     | Status     |
| -------------------------- | ---------- |
| Dashboard                  | ✅ Complete |
| Customer Management        | ✅ Complete |
| Terminal Management        | ✅ Complete |
| Session Management         | ✅ Complete |
| Session Billing            | ✅ Complete |
| Service Management         | ✅ Complete |
| Printing                   | ✅ Complete |
| Colour Printing            | ✅ Complete |
| Xerox                      | ✅ Complete |
| Service Usage              | ✅ Complete |
| Final Billing              | ✅ Complete |
| Invoice Generation         | ✅ Complete |
| Printable Invoice          | ✅ Complete |
| MongoDB Integration        | ✅ Complete |
| GitHub Repository          | ✅ Complete |
| Vercel Frontend Deployment | ✅ Complete |

---

## 🎓 Academic Project

This project demonstrates practical implementation of:

* Full-stack web development
* MERN architecture
* CRUD operations
* REST APIs
* MongoDB database design
* Mongoose relationships
* React component development
* React routing
* Form handling
* Dynamic billing calculations
* Backend/frontend integration
* Git and GitHub
* Cloud deployment

---

## 🔮 Future Enhancements

Possible future improvements include:

* 🔐 Admin authentication
* 💳 Persistent payment management
* 📊 Revenue reports
* 📅 Daily/monthly reports
* 📈 Revenue charts
* 🧾 Invoice database
* 🔍 Search and filtering
* 📥 PDF invoice download
* 👤 User roles and permissions
* 📱 Mobile-friendly improvements

---

## 👨‍💻 Author

**Mukesh Mandala**

GitHub:
https://github.com/mukeshmandala123

---

## 📄 License

This project is developed for **educational and academic purposes**.

---

⭐ If you find this project useful, consider giving the repository a star!
