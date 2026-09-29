# Smart Restaurant Ordering & Kitchen Display System

Full-stack project based on the supplied abstract:

- Digital table-side ordering for customers or waitstaff
- Live Kitchen Display System with `received`, `preparing`, and `ready` stages
- Front-of-house dashboard to reduce verbal follow-ups
- Menu, order history, preparation times, and analytics
- Voice-assisted item selection using the browser Web Speech API
- UPI amount summary and QR code payment from selected cart items
- Saved order history and payment history
- Table availability view showing booked and empty tables
- MySQL and Redis-ready backend with an in-memory fallback for easy demos

## Technologies Used

Frontend:

- React.js for the customer/waiter ordering interface
- Vite for running and building the React app
- Socket.IO Client for live order updates
- Web Speech API for voice-based item selection
- qrcode package for generating UPI payment QR codes
- Lucide React for icons
- CSS for responsive UI design

Backend:

- Node.js as the server runtime
- Express.js for REST API routes
- Socket.IO for real-time kitchen display updates
- MySQL for menu, orders, users, and order history storage
- Redis for live order queue caching
- dotenv for environment variables

Tools:

- VS Code for development
- Postman or browser for API testing
- npm for package installation
- Git/GitHub for version control

## How To Run In VS Code

1. Open VS Code.
2. Click `File > Open Folder`.
3. Select this folder:

```text
C:\Users\Manikanta\Downloads\DBMS
```

4. Open the VS Code terminal with `Terminal > New Terminal`.
5. Install all dependencies:

```bash
npm.cmd run install:all
```

6. Start the complete system:

```bash
npm.cmd run dev
```

This starts the backend and frontend, then opens the Customer, KDS, and Admin panels in separate browser tabs automatically.

7. To start the frontend without opening browser tabs:

```bash
npm.cmd run dev --prefix frontend
```

8. The panels are also available at:

```text
Customer panel: http://127.0.0.1:5173/customer.html
KDS panel:      http://127.0.0.1:5173/kds.html
Admin panel:    http://127.0.0.1:5173/admin.html
```

Backend API runs here:

```text
http://127.0.0.1:4000
```

## History Storage

The project stores order history and payment history.

- If MySQL is configured, history is stored in MySQL tables.
- If MySQL is not configured, demo history is stored locally in:

```text
backend/data/store.json
```

Use the `History` tab in the website to see saved orders and payments.

## Table Booking Status

The website has a `Tables` tab with 12 restaurant tables.

- Green/empty tables are available for new orders.
- Orange/booked tables have active orders.
- When an order is moved to `Ready to Serve`, that table becomes empty again.
- The customer, KDS, and admin experiences are separate panels. Admin table cards are read-only; use the customer panel URL to place orders.

Panel URLs:

```text
Customer: http://127.0.0.1:5173/customer.html
KDS:      http://127.0.0.1:5173/kds.html
Admin:    http://127.0.0.1:5173/admin.html
```

## Quick Run

```bash
npm run install:all
npm run dev
```

Customer panel: http://localhost:5173/customer.html  
KDS panel: http://localhost:5173/kds.html  
Admin panel: http://localhost:5173/admin.html  
Backend: http://localhost:4000

## Optional MySQL / Redis

Copy `backend/.env.example` to `backend/.env` and set your database values. If no MySQL settings are supplied, the backend runs with demo in-memory data.

```bash
mysql -u root -p < backend/schema.sql
```

Voice ordering works best in Chrome or Edge on `localhost`. Click the microphone button and say things like:

- "Add two biryani and one mango lassi"
- "I want masala dosa"
- "Add paneer tikka"

## UPI Payment QR

The frontend generates a QR code from the selected cart total. Change the demo UPI ID in:

```text
frontend/src/main.jsx
```

Update this line with your real UPI ID:

```js
const UPI_ID = "restaurant@upi";
```
