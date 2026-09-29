import mysql from "mysql2/promise";
import { createClient } from "redis";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { v4 as uuid } from "uuid";

const seedMenu = [
  { id: "m1", name: "Hyderabadi Chicken Biryani", category: "Biryani", price: 240, prepMinutes: 18, available: true },
  { id: "m2", name: "Veg Dum Biryani", category: "Biryani", price: 180, prepMinutes: 16, available: true },
  { id: "m3", name: "Paneer Biryani", category: "Biryani", price: 210, prepMinutes: 17, available: true },
  { id: "m4", name: "Mutton Biryani", category: "Biryani", price: 320, prepMinutes: 24, available: true },
  { id: "m5", name: "Egg Biryani", category: "Biryani", price: 170, prepMinutes: 14, available: true },
  { id: "m6", name: "Family Chicken Biryani", category: "Biryani", price: 560, prepMinutes: 25, available: true },
  { id: "m7", name: "Paneer Tikka", category: "Starters", price: 180, prepMinutes: 14, available: true },
  { id: "m8", name: "Chicken 65", category: "Starters", price: 210, prepMinutes: 13, available: true },
  { id: "m9", name: "Veg Manchurian", category: "Starters", price: 150, prepMinutes: 11, available: true },
  { id: "m10", name: "Gobi Manchurian", category: "Starters", price: 140, prepMinutes: 11, available: true },
  { id: "m11", name: "Chilli Paneer", category: "Starters", price: 190, prepMinutes: 12, available: true },
  { id: "m12", name: "Chicken Lollipop", category: "Starters", price: 230, prepMinutes: 15, available: true },
  { id: "m13", name: "Masala Dosa", category: "South Indian", price: 90, prepMinutes: 8, available: true },
  { id: "m14", name: "Plain Dosa", category: "South Indian", price: 70, prepMinutes: 7, available: true },
  { id: "m15", name: "Idli Sambar", category: "South Indian", price: 60, prepMinutes: 5, available: true },
  { id: "m16", name: "Medu Vada", category: "South Indian", price: 65, prepMinutes: 6, available: true },
  { id: "m17", name: "Poori Bhaji", category: "South Indian", price: 85, prepMinutes: 8, available: true },
  { id: "m18", name: "Onion Uttapam", category: "South Indian", price: 95, prepMinutes: 10, available: true },
  { id: "m19", name: "Veg Fried Rice", category: "Rice & Noodles", price: 140, prepMinutes: 10, available: true },
  { id: "m20", name: "Chicken Fried Rice", category: "Rice & Noodles", price: 180, prepMinutes: 12, available: true },
  { id: "m21", name: "Schezwan Fried Rice", category: "Rice & Noodles", price: 170, prepMinutes: 12, available: true },
  { id: "m22", name: "Veg Noodles", category: "Rice & Noodles", price: 130, prepMinutes: 10, available: true },
  { id: "m23", name: "Chicken Noodles", category: "Rice & Noodles", price: 175, prepMinutes: 12, available: true },
  { id: "m24", name: "Curd Rice", category: "Rice & Noodles", price: 95, prepMinutes: 4, available: true },
  { id: "m25", name: "Paneer Butter Masala", category: "Curries", price: 190, prepMinutes: 15, available: true },
  { id: "m26", name: "Chicken Curry", category: "Curries", price: 230, prepMinutes: 16, available: true },
  { id: "m27", name: "Dal Tadka", category: "Curries", price: 130, prepMinutes: 12, available: true },
  { id: "m28", name: "Butter Chicken", category: "Curries", price: 260, prepMinutes: 18, available: true },
  { id: "m29", name: "Mushroom Masala", category: "Curries", price: 175, prepMinutes: 14, available: true },
  { id: "m30", name: "Mixed Veg Curry", category: "Curries", price: 150, prepMinutes: 13, available: true },
  { id: "m31", name: "Butter Naan", category: "Breads", price: 45, prepMinutes: 5, available: true },
  { id: "m32", name: "Tandoori Roti", category: "Breads", price: 35, prepMinutes: 4, available: true },
  { id: "m33", name: "Garlic Naan", category: "Breads", price: 60, prepMinutes: 6, available: true },
  { id: "m34", name: "Chapati", category: "Breads", price: 25, prepMinutes: 4, available: true },
  { id: "m35", name: "Parotta", category: "Breads", price: 40, prepMinutes: 5, available: true },
  { id: "m36", name: "Cheese Naan", category: "Breads", price: 80, prepMinutes: 7, available: true },
  { id: "m37", name: "Veg Burger", category: "Snacks", price: 110, prepMinutes: 9, available: true },
  { id: "m38", name: "French Fries", category: "Snacks", price: 90, prepMinutes: 7, available: true },
  { id: "m39", name: "Veg Sandwich", category: "Snacks", price: 100, prepMinutes: 8, available: true },
  { id: "m40", name: "Samosa Plate", category: "Snacks", price: 50, prepMinutes: 5, available: true },
  { id: "m41", name: "Gulab Jamun", category: "Desserts", price: 70, prepMinutes: 4, available: true },
  { id: "m42", name: "Chocolate Brownie", category: "Desserts", price: 120, prepMinutes: 5, available: true },
  { id: "m43", name: "Ice Cream Sundae", category: "Desserts", price: 130, prepMinutes: 4, available: true },
  { id: "m44", name: "Rasmalai", category: "Desserts", price: 110, prepMinutes: 4, available: true },
  { id: "m45", name: "Mango Lassi", category: "Beverages", price: 80, prepMinutes: 3, available: true },
  { id: "m46", name: "Fresh Lime Soda", category: "Beverages", price: 70, prepMinutes: 3, available: true },
  { id: "m47", name: "Cold Coffee", category: "Beverages", price: 110, prepMinutes: 5, available: true },
  { id: "m48", name: "Masala Tea", category: "Beverages", price: 35, prepMinutes: 4, available: true }
];

const memory = {
  menu: seedMenu,
  orders: [],
  payments: []
};

let pool = null;
let redisClient = null;
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const storePath = path.join(currentDir, "..", "data", "store.json");

export async function connectStores() {
  if (process.env.DB_HOST) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT || 3306),
      waitForConnections: true,
      connectionLimit: 10
    });
    await pool.query("SELECT 1");
  }

  if (process.env.REDIS_URL) {
    redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.on("error", (error) => console.warn("Redis unavailable:", error.message));
    await redisClient.connect();
  }

  if (!pool) {
    await loadMemoryStore();
  }
}

export async function getMenu() {
  if (!pool) return memory.menu;
  const [rows] = await pool.query(
    "SELECT id, name, category, price, prep_minutes AS prepMinutes, available FROM menu_items ORDER BY category, name"
  );
  return rows.map((item) => ({ ...item, price: Number(item.price), available: Boolean(item.available) }));
}

export async function createMenuItem(payload) {
  const item = {
    id: `m-${uuid()}`,
    name: String(payload.name || "").trim(),
    category: String(payload.category || "Other").trim(),
    price: Number(payload.price || 0),
    prepMinutes: Math.max(1, Number(payload.prepMinutes || 1)),
    available: payload.available !== false
  };
  if (!item.name || item.price <= 0) throw Object.assign(new Error("Name and positive price are required."), { status: 400 });
  if (!pool) {
    memory.menu.push(item);
    await saveMemoryStore();
    return item;
  }
  await pool.query("INSERT INTO menu_items (id, name, category, price, prep_minutes, available) VALUES (?, ?, ?, ?, ?, ?)", [item.id, item.name, item.category, item.price, item.prepMinutes, item.available]);
  return item;
}

export async function updateMenuItem(id, payload) {
  const current = (await getMenu()).find((item) => item.id === id);
  if (!current) return null;
  const item = { ...current, ...payload, price: Number(payload.price ?? current.price), prepMinutes: Number(payload.prepMinutes ?? current.prepMinutes), available: payload.available !== undefined ? Boolean(payload.available) : current.available };
  if (!pool) {
    Object.assign(memory.menu.find((candidate) => candidate.id === id), item);
    await saveMemoryStore();
    return item;
  }
  await pool.query("UPDATE menu_items SET name = ?, category = ?, price = ?, prep_minutes = ?, available = ? WHERE id = ?", [item.name, item.category, item.price, item.prepMinutes, item.available, id]);
  return item;
}

export async function getOrders() {
  if (!pool) return memory.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const [orders] = await pool.query(
    "SELECT id, table_no AS tableNo, customer_name AS customerName, status, notes, created_at AS createdAt, updated_at AS updatedAt, ready_at AS readyAt FROM orders ORDER BY created_at DESC"
  );
  const [items] = await pool.query(
    "SELECT order_id AS orderId, menu_item_id AS menuItemId, name, quantity, price FROM order_items"
  );

  return orders.map((order) => ({
    ...order,
    items: items
      .filter((item) => item.orderId === order.id)
      .map(({ orderId, ...item }) => ({ ...item, price: Number(item.price) })),
    total: items
      .filter((item) => item.orderId === order.id)
      .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  }));
}

export async function getOrderById(id) {
  return (await getOrders()).find((order) => order.id === id) || null;
}

export async function getPayments() {
  if (!pool) return memory.payments.sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));

  const [rows] = await pool.query(
    "SELECT id, order_id AS orderId, table_no AS tableNo, amount, method, upi_id AS upiId, transaction_ref AS transactionRef, status, paid_at AS paidAt FROM payments ORDER BY paid_at DESC"
  );
  return rows.map((payment) => ({ ...payment, amount: Number(payment.amount) }));
}

export async function createOrder(payload) {
  const menu = await getMenu();
  const orderItems = payload.items
    .map((item) => {
      const menuItem = menu.find((candidate) => candidate.id === item.menuItemId);
      if (!menuItem || !menuItem.available) return null;
      return {
        menuItemId: menuItem.id,
        name: menuItem.name,
        quantity: Math.max(1, Number(item.quantity || 1)),
        price: Number(menuItem.price)
      };
    })
    .filter(Boolean);

  if (!orderItems.length) {
    const error = new Error("Order must contain at least one available menu item.");
    error.status = 400;
    throw error;
  }

  const now = new Date();
  const order = {
    id: uuid(),
    tableNo: String(payload.tableNo || "").trim() || "Takeaway",
    customerName: String(payload.customerName || "").trim(),
    notes: String(payload.notes || "").trim(),
    status: "received",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    readyAt: null,
    items: orderItems,
    total: orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  };

  if (!pool) {
    memory.orders.unshift(order);
    await saveMemoryStore();
    await cacheLiveQueue();
    return order;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(
      "INSERT INTO orders (id, table_no, customer_name, status, notes) VALUES (?, ?, ?, ?, ?)",
      [order.id, order.tableNo, order.customerName, order.status, order.notes]
    );
    for (const item of order.items) {
      await connection.query(
        "INSERT INTO order_items (order_id, menu_item_id, name, quantity, price) VALUES (?, ?, ?, ?, ?)",
        [order.id, item.menuItemId, item.name, item.quantity, item.price]
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  await cacheLiveQueue();
  return order;
}

export async function updateOrderStatus(id, status) {
  const allowed = ["received", "preparing", "ready"];
  if (!allowed.includes(status)) {
    const error = new Error("Invalid order status.");
    error.status = 400;
    throw error;
  }

  const now = new Date().toISOString();
  if (!pool) {
    const order = memory.orders.find((candidate) => candidate.id === id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = now;
    order.readyAt = status === "ready" ? now : order.readyAt;
    await saveMemoryStore();
    await cacheLiveQueue();
    return order;
  }

  await pool.query(
    "UPDATE orders SET status = ?, ready_at = IF(? = 'ready', NOW(), ready_at) WHERE id = ?",
    [status, status, id]
  );
  const orders = await getOrders();
  await cacheLiveQueue();
  return orders.find((order) => order.id === id) || null;
}

export async function createPayment(payload) {
  const amount = Number(payload.amount || 0);
  if (!amount || amount <= 0) {
    const error = new Error("Payment amount must be greater than zero.");
    error.status = 400;
    throw error;
  }

  const payment = {
    id: uuid(),
    orderId: payload.orderId || null,
    tableNo: String(payload.tableNo || "").trim() || "Takeaway",
    amount,
    method: payload.method || "UPI",
    upiId: payload.upiId || "restaurant@upi",
    transactionRef: payload.transactionRef || `UPI-${Date.now()}`,
    status: "paid",
    paidAt: new Date().toISOString()
  };

  if (!pool) {
    memory.payments.unshift(payment);
    await saveMemoryStore();
    return payment;
  }

  await pool.query(
    "INSERT INTO payments (id, order_id, table_no, amount, method, upi_id, transaction_ref, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [payment.id, payment.orderId, payment.tableNo, payment.amount, payment.method, payment.upiId, payment.transactionRef, payment.status]
  );
  return payment;
}

export async function getAnalytics() {
  const orders = await getOrders();
  const payments = await getPayments();
  const readyOrders = orders.filter((order) => order.readyAt);
  const popular = new Map();
  const hourly = new Map();

  for (const order of orders) {
    const hour = new Date(order.createdAt).getHours();
    hourly.set(hour, (hourly.get(hour) || 0) + 1);
    for (const item of order.items) {
      popular.set(item.name, (popular.get(item.name) || 0) + item.quantity);
    }
  }

  const averagePrepMinutes = readyOrders.length
    ? readyOrders.reduce((sum, order) => sum + (new Date(order.readyAt) - new Date(order.createdAt)) / 60000, 0) / readyOrders.length
    : 0;

  return {
    totalOrders: orders.length,
    activeOrders: orders.filter((order) => order.status !== "ready").length,
    totalPayments: payments.length,
    revenue: payments.reduce((sum, payment) => sum + payment.amount, 0),
    averagePrepMinutes: Number(averagePrepMinutes.toFixed(1)),
    popularItems: [...popular.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, quantity]) => ({ name, quantity })),
    peakHours: [...hourly.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([hour, count]) => ({ hour, count }))
  };
}

async function cacheLiveQueue() {
  if (!redisClient) return;
  const orders = await getOrders();
  const liveQueue = orders.filter((order) => order.status !== "ready");
  await redisClient.set("kds:live-queue", JSON.stringify(liveQueue), { EX: 120 });
}

async function loadMemoryStore() {
  try {
    const raw = await readFile(storePath, "utf8");
    const parsed = JSON.parse(raw);
    memory.orders = Array.isArray(parsed.orders) ? parsed.orders : [];
    memory.payments = Array.isArray(parsed.payments) ? parsed.payments : [];
  } catch {
    await saveMemoryStore();
  }
}

async function saveMemoryStore() {
  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, JSON.stringify({ orders: memory.orders, payments: memory.payments }, null, 2));
}
