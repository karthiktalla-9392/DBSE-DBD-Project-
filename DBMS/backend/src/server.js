import "dotenv/config";
import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { connectStores, createOrder, createPayment, getAnalytics, getMenu, getOrders, getPayments, updateOrderStatus } from "./data.js";
import { login, requireRole } from "./auth.js";
import { createMenuItem, getOrderById, updateMenuItem } from "./data.js";

const app = express();
const server = http.createServer(app);
const port = Number(process.env.PORT || 4000);
const maxPortAttempts = 5;
const clientOrigins = [process.env.CLIENT_ORIGIN || "http://localhost:5173", "http://127.0.0.1:5173"];

const io = new Server(server, {
  cors: { origin: true, methods: ["GET", "POST", "PATCH"] }
});

app.use(cors({ origin: true }));
app.use(express.json());

app.post("/api/auth/login", (request, response) => {
  const session = login(request.body.username, request.body.password);
  if (!session) return response.status(401).json({ message: "Invalid username or password." });
  response.json(session);
});

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, service: "Smart Restaurant KDS API" });
});

app.get("/api/menu", async (_request, response, next) => {
  try {
    response.json(await getMenu());
  } catch (error) {
    next(error);
  }
});

app.get("/api/orders", async (_request, response, next) => {
  try {
    response.json(await getOrders());
  } catch (error) {
    next(error);
  }
});

app.get("/api/orders/:id", async (request, response, next) => {
  try {
    const order = await getOrderById(request.params.id);
    if (!order) return response.status(404).json({ message: "Order not found." });
    response.json(order);
  } catch (error) { next(error); }
});

app.get("/api/payments", async (_request, response, next) => {
  try {
    response.json(await getPayments());
  } catch (error) {
    next(error);
  }
});

app.post("/api/orders", async (request, response, next) => {
  try {
    const order = await createOrder(request.body);
    io.emit("order:created", order);
    io.emit("orders:changed", await getOrders());
    response.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

app.patch("/api/orders/:id/status", requireRole("kds", "admin"), async (request, response, next) => {
  try {
    const order = await updateOrderStatus(request.params.id, request.body.status);
    if (!order) return response.status(404).json({ message: "Order not found." });
    io.emit("order:updated", order);
    io.emit("orders:changed", await getOrders());
    response.json(order);
  } catch (error) {
    next(error);
  }
});

app.post("/api/payments", async (request, response, next) => {
  try {
    const payment = await createPayment(request.body);
    io.emit("payment:created", payment);
    io.emit("payments:changed", await getPayments());
    response.status(201).json(payment);
  } catch (error) {
    next(error);
  }
});

app.get("/api/analytics", requireRole("admin"), async (_request, response, next) => {
  try {
    response.json(await getAnalytics());
  } catch (error) {
    next(error);
  }
});

app.post("/api/menu", requireRole("admin"), async (request, response, next) => {
  try { response.status(201).json(await createMenuItem(request.body)); } catch (error) { next(error); }
});

app.patch("/api/menu/:id", requireRole("admin"), async (request, response, next) => {
  try {
    const item = await updateMenuItem(request.params.id, request.body);
    if (!item) return response.status(404).json({ message: "Menu item not found." });
    response.json(item);
  } catch (error) { next(error); }
});

app.use((error, _request, response, _next) => {
  const status = error.status || 500;
  response.status(status).json({ message: error.message || "Server error" });
});

io.on("connection", async (socket) => {
  socket.emit("orders:changed", await getOrders());
});

await connectStores();

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${server.currentPort} is already in use. Trying port ${server.currentPort + 1}...`);
    listenWithFallback(server.currentPort + 1, server.portAttempts + 1);
    return;
  }
  if (error.code === "EACCES") {
    console.error(`Port ${server.currentPort} cannot be opened. Try another port with: set PORT=4001`);
    process.exit(1);
  }
  throw error;
});

listenWithFallback(port, 1);

function listenWithFallback(nextPort, attempt) {
  if (attempt > maxPortAttempts) {
    console.error(`Could not start backend. Ports ${port}-${port + maxPortAttempts - 1} are busy.`);
    console.error(`Stop old backend terminals or run: npx kill-port ${port}`);
    process.exit(1);
  }

  server.currentPort = nextPort;
  server.portAttempts = attempt;
  server.listen(nextPort, () => {
    console.log(`Smart Restaurant KDS API running on http://localhost:${nextPort}`);
  });
}
