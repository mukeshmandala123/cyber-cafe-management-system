\# Cyber Cafe Management System



A full-stack MERN-based Cyber Cafe Management System designed to manage customers, computer terminals, sessions, printing/Xerox services, and billing from a single web application.



\## 🚀 Features



\### Dashboard



\* Total customers

\* Total terminals

\* Available terminals

\* Active sessions

\* Live backend data



\### Customer Management



\* Add customers

\* View customer details

\* Manage customer records

\* Customer phone number management



\### Terminal Management



\* Add and manage terminals

\* Terminal number

\* Terminal type

\* Terminal status

\* Available/occupied terminal tracking



\### Session Management



\* Start customer sessions

\* Assign customers to terminals

\* Stop active sessions

\* Automatically calculate session duration

\* Automatically calculate session charges

\* Session history



\### Services



\* Plain Printer

\* Colour Printer

\* Xerox

\* Service availability tracking

\* Rate per page

\* Service usage history

\* Automatic service charge calculation



\### Billing



\* Combine computer session charges

\* Combine printing/Xerox charges

\* Customer invoice

\* Payment status

\* Grand total calculation

\* Printable invoice



\## 🛠️ Technologies Used



\### Frontend



\* React.js

\* React Router

\* Bootstrap

\* CSS

\* Vite



\### Backend



\* Node.js

\* Express.js

\* REST API



\### Database



\* MongoDB

\* Mongoose



\## 📁 Project Structure



```text

cyber-cafe-management/

│

├── client/

│   ├── public/

│   └── src/

│       ├── pages/

│       │   ├── Billing.jsx

│       │   ├── Customers.jsx

│       │   ├── Services.jsx

│       │   ├── Sessions.jsx

│       │   └── Terminals.jsx

│       ├── App.jsx

│       ├── App.css

│       ├── index.css

│       └── main.jsx

│

├── server/

│   ├── config/

│   │   └── db.js

│   ├── controllers/

│   ├── models/

│   ├── routes/

│   └── server.js

│

├── .gitignore

├── package.json

└── README.md

```



\## ⚙️ Installation



\### 1. Clone the repository



```bash

git clone https://github.com/mukeshmandala123/cyber-cafe-management-system.git

```



\### 2. Open the project



```bash

cd cyber-cafe-management-system

```



\### 3. Install backend dependencies



```bash

cd server

npm install

```



\### 4. Configure environment variables



Create a `.env` file inside the `server` folder:



```env

PORT=5000

MONGO\_URI=your\_mongodb\_connection\_string

```



Do not upload the `.env` file to GitHub.



\### 5. Start the backend



```bash

npm run dev

```



The backend runs on:



```text

http://localhost:5000

```



\### 6. Install frontend dependencies



Open another terminal:



```bash

cd client

npm install

```



\### 7. Start the frontend



```bash

npm run dev

```



The frontend runs on:



```text

http://localhost:5173

```



\## 🔄 Application Workflow



```text

Customer

&#x20;  ↓

Terminal

&#x20;  ↓

Start Session

&#x20;  ↓

Use Computer

&#x20;  ↓

Stop Session

&#x20;  ↓

Session Bill

&#x20;  ↓

Printer / Xerox Usage

&#x20;  ↓

Service Bill

&#x20;  ↓

Final Billing

&#x20;  ↓

Printable Invoice

```



\## 💰 Billing



The system automatically calculates:



```text

Computer Session Charges

&#x20;           +

Printing / Xerox Charges

&#x20;           =

Final Invoice Total

```



Example:



```text

Computer Sessions    ₹1.67

Services             ₹54.00

\---------------------------

Grand Total          ₹55.67

```



\## 🔒 Security



Sensitive environment variables such as MongoDB credentials and secret keys are stored in `.env` and excluded from Git using `.gitignore`.



\## 🎓 Project Purpose



This project was developed as an academic full-stack web application to demonstrate:



\* MERN stack development

\* REST API development

\* MongoDB database integration

\* React frontend development

\* CRUD operations

\* Routing

\* Data relationships

\* Automatic billing

\* Real-world business workflow implementation



\## 👨‍💻 Author



\*\*Mukesh Mandala\*\*



\## 📄 License



This project is intended for educational and academic purposes.



