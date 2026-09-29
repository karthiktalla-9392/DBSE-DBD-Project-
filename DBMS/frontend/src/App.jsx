import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import QRCode from "qrcode";
import {
  Armchair,
  BarChart3,
  ChefHat,
  CheckCircle2,
  Clock,
  History,
  Lightbulb,
  Mic,
  Minus,
  Plus,
  QrCode,
  RefreshCw,
  Send,
  Sparkles,
  Users,
  Volume2,
  Wallet
} from "lucide-react";
import "./styles.css";

const API_HOST = window.location.hostname || "localhost";
const API_URL = import.meta.env.VITE_API_URL || `http://${API_HOST}:4000`;
const UPI_ID = "9849175751-2@ybl";
const PAYEE_NAME = "Smart Restaurant KDS";
const socket = io(API_URL);
const statusLabels = { received: "Received", preparing: "In Preparation", ready: "Ready to Serve" };
const nextStatus = { received: "preparing", preparing: "ready" };
const restaurantTables = Array.from({ length: 12 }, (_item, index) => `T${index + 1}`);
const demoMenu = [
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
const smartNeeds = [
  { label: "Quick Bite", words: ["quick", "fast", "soon", "hurry"], picks: ["Masala Dosa", "Mango Lassi"] },
  { label: "Biryani Support", words: ["biryani", "briyani", "biriyani", "dum"], picks: ["Hyderabadi Chicken Biryani", "Veg Dum Biryani"] },
  { label: "Spicy Meal", words: ["spicy", "hot", "masala"], picks: ["Hyderabadi Chicken Biryani", "Paneer Tikka"] },
  { label: "Rice Combo", words: ["rice", "hungry", "full meal", "heavy"], picks: ["Hyderabadi Chicken Biryani", "Dal Tadka"] },
  { label: "Dessert Support", words: ["sweet", "dessert", "desert", "ice cream"], picks: ["Gulab Jamun", "Ice Cream Sundae"] },
  { label: "Cool Drink", words: ["drink", "cool", "lassi", "juice", "soda"], picks: ["Mango Lassi", "Fresh Lime Soda"] }
];

export default function App({ fixedPanel = "customer" }) {
  const panel = fixedPanel;
  const role = panel === "kds" ? "kds" : panel;
  const [auth, setAuth] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`restaurant-auth-${role}`)) || null; } catch { return null; }
  });
  const [menu, setMenu] = useState(demoMenu);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [cart, setCart] = useState({});
  const [tableNo, setTableNo] = useState("T1");
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [message, setMessage] = useState("");
  const [paymentQr, setPaymentQr] = useState("");
  const [trackedOrder, setTrackedOrder] = useState(null);

  async function apiFetch(path, options = {}) {
    const headers = { ...(options.body ? { "Content-Type": "application/json" } : {}), ...(options.headers || {}) };
    if (auth?.token) headers.Authorization = `Bearer ${auth.token}`;
    return fetch(`${API_URL}${path}`, { ...options, headers });
  }

  async function loadData() {
    try {
      const [menuResponse, ordersResponse, paymentsResponse, analyticsResponse] = await Promise.all([
        apiFetch("/api/menu"),
        apiFetch("/api/orders"),
        apiFetch("/api/payments"),
        apiFetch("/api/analytics")
      ]);

      const menuData = menuResponse.ok ? await menuResponse.json() : demoMenu;
      const orderData = ordersResponse.ok ? await ordersResponse.json() : [];
      const paymentData = paymentsResponse.ok ? await paymentsResponse.json() : [];
      const analyticsData = analyticsResponse.ok ? await analyticsResponse.json() : null;

      setMenu(Array.isArray(menuData) && menuData.length ? menuData : demoMenu);
      setOrders(Array.isArray(orderData) ? orderData : []);
      setPayments(Array.isArray(paymentData) ? paymentData : []);
      setAnalytics(analyticsData);
    } catch {
      setMenu(demoMenu);
      setMessage("Using demo menu. Check that backend is running on port 4000.");
    }
  }

  useEffect(() => {
    if (!auth && panel !== "customer") return undefined;
    loadData();
    socket.on("orders:changed", (latestOrders) => {
      setOrders(latestOrders);
      refreshAnalytics();
    });
    socket.on("payments:changed", (latestPayments) => {
      setPayments(latestPayments);
      refreshAnalytics();
    });

    return () => {
      socket.off("orders:changed");
      socket.off("payments:changed");
    };
  }, [auth]);

  async function refreshAnalytics() {
    try {
      const response = await apiFetch("/api/analytics");
      if (response.ok) setAnalytics(await response.json());
    } catch {
      // Keep the panels usable with the last known values.
    }
  }

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, quantity]) => ({ ...menu.find((item) => item.id === id), quantity }))
      .filter((item) => item.id);
  }, [cart, menu]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const categories = useMemo(() => ["All", ...new Set(menu.map((item) => item.category))], [menu]);
  const filteredMenu = useMemo(() => {
    const text = searchText.trim().toLowerCase();
    return menu.filter((item) => {
      const categoryMatch = selectedCategory === "All" || item.category === selectedCategory;
      const textMatch = !text || `${item.name} ${item.category}`.toLowerCase().includes(text);
      return item.available && categoryMatch && textMatch;
    });
  }, [menu, selectedCategory, searchText]);
  const tableStatuses = useMemo(() => {
    return restaurantTables.map((table) => {
      const activeOrder = orders.find((order) => order.tableNo === table && order.status !== "ready");
      return { table, status: activeOrder ? "booked" : "empty", order: activeOrder || null };
    });
  }, [orders]);
  const bookedTables = tableStatuses.filter((table) => table.status === "booked").length;
  const emptyTables = tableStatuses.length - bookedTables;
  const upiLink = useMemo(() => {
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: PAYEE_NAME,
      am: cartTotal.toFixed(2),
      cu: "INR",
      tn: `Table ${tableNo} restaurant order`
    });
    return `upi://pay?${params.toString()}`;
  }, [cartTotal, tableNo]);

  useEffect(() => {
    if (!cartTotal) {
      setPaymentQr("");
      return;
    }
    QRCode.toDataURL(upiLink, { width: 180, margin: 1 })
      .then(setPaymentQr)
      .catch(() => setPaymentQr(""));
  }, [upiLink, cartTotal]);

  function updateCart(id, amount) {
    setCart((current) => {
      const quantity = Math.max(0, (current[id] || 0) + amount);
      const updated = { ...current, [id]: quantity };
      if (!quantity) delete updated[id];
      return updated;
    });
  }

  async function submitOrder(markPaid = false) {
    if (!cartItems.length) {
      setMessage("Add at least one item before sending the order.");
      return;
    }
    const response = await apiFetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableNo,
        customerName,
        notes,
        items: cartItems.map((item) => ({ menuItemId: item.id, quantity: item.quantity }))
      })
    });
    if (!response.ok) {
      const error = await response.json();
      setMessage(error.message || "Order failed.");
      return;
    }
    const order = await response.json();
    setTrackedOrder(order);
    if (markPaid) {
      await recordPayment(order.id, order.total, order.tableNo);
    }
    setCart({});
    setNotes("");
    setCustomerName("");
    setMessage(markPaid ? "Order sent and UPI payment saved." : "Order sent to kitchen display.");
    await loadData();
  }

  async function recordPayment(orderId = null, amount = cartTotal, table = tableNo) {
    if (!amount) {
      setMessage("Add items before saving payment.");
      return;
    }

    const response = await apiFetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        tableNo: table,
        amount,
        method: "UPI",
        upiId: UPI_ID,
        transactionRef: `UPI-${Date.now()}`
      })
    });
    if (!response.ok) {
      const error = await response.json();
      setMessage(error.message || "Payment save failed.");
      return;
    }
    setMessage("Payment history saved.");
    loadData();
  }

  async function changeStatus(order, status) {
    await apiFetch(`/api/orders/${order.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
  }

  function startVoiceOrder() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessage("Voice ordering is supported in Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setMessage("Could not understand the voice command. Try again.");
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setVoiceText(transcript);
      const matched = addItemsFromSpeech(transcript);
      const smartMatched = matched || addSmartSuggestion(transcript);
      const response = smartMatched
        ? `Added ${smartMatched} item(s) with smart voice assistant.`
        : "No menu item matched. Try saying a dish name or say quick, spicy, rice, sweet, or drink.";
      setMessage(response);
      speak(response);
    };
    recognition.start();
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const voice = new SpeechSynthesisUtterance(text);
    voice.lang = "en-IN";
    voice.rate = 0.95;
    window.speechSynthesis.speak(voice);
  }

  function addSmartSuggestion(textOrNeed) {
    const need = smartNeeds.find((candidate) => (
      candidate.label.toLowerCase() === textOrNeed.toLowerCase()
      || candidate.words.some((word) => textOrNeed.includes(word))
    ));
    if (!need) return 0;

    let added = 0;
    for (const pick of need.picks) {
      const item = menu.find((candidate) => candidate.name === pick);
      if (item) {
        updateCart(item.id, 1);
        added += 1;
      }
    }
    return added;
  }

  function chooseSmartNeed(need) {
    const added = addSmartSuggestion(need.label);
    const response = added ? `${need.label} added to your order.` : "Suggestion is not available right now.";
    setMessage(response);
    speak(response);
  }

  function addItemsFromSpeech(transcript) {
    const numberWords = { one: 1, two: 2, three: 3, four: 4, five: 5 };
    let matches = 0;
    for (const item of menu) {
      const name = item.name.toLowerCase();
      const looseName = name.replace(/[^a-z0-9 ]/g, "");
      if (transcript.includes(name) || transcript.includes(looseName)) {
        const beforeName = transcript.slice(0, transcript.indexOf(name.split(" ")[0])).split(" ").slice(-3);
        const quantity = beforeName.map((word) => numberWords[word] || Number(word)).find((value) => Number.isFinite(value)) || 1;
        updateCart(item.id, quantity);
        matches += quantity;
      }
    }
    return matches;
  }

  const sharedProps = {
    analytics,
    auth,
    bookedTables,
    cart,
    cartItems,
    cartTotal,
    categories,
    changeStatus,
    chooseSmartNeed,
    customerName,
    emptyTables,
    filteredMenu,
    listening,
    loadData,
    message,
    menu,
    notes,
    orders,
    paymentQr,
    payments,
    searchText,
    selectedCategory,
    setCustomerName,
    setNotes,
    setSearchText,
    setSelectedCategory,
    setTableNo,
    startVoiceOrder,
    submitOrder,
    tableNo,
    tableStatuses,
    updateCart,
    voiceText,
    apiFetch
  };

  if (!auth && panel !== "customer") return <LoginPanel panel={panel} onLogin={(session) => {
    localStorage.setItem(`restaurant-auth-${role}`, JSON.stringify(session));
    setAuth(session);
  }} />;

  return (
    <main>
      <PanelHeader panel={panel} loadData={loadData} />
      {message && <p className="toast">{message}</p>}
      {panel === "customer" && <CustomerPanel {...sharedProps} />}
      {panel === "customer" && trackedOrder && <OrderTracking order={trackedOrder} />}
      {panel === "kds" && <KdsPanel {...sharedProps} />}
      {panel === "admin" && <AdminPanel {...sharedProps} />}
    </main>
  );
}

function LoginPanel({ panel, onLogin }) {
  const [username, setUsername] = useState(panel === "kds" ? "kitchen" : panel);
  const [password, setPassword] = useState(panel === "kds" ? "kitchen123" : panel === "admin" ? "admin123" : "customer123");
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    const response = await fetch(`${API_URL}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
    if (!response.ok) { setError("Invalid login details."); return; }
    const session = await response.json();
    if (session.role !== panel) { setError(`Use the ${session.role === "kds" ? "kitchen" : session.role} account for this panel.`); return; }
    onLogin(session);
  }
  return <main className="login-page"><form className="login-card" onSubmit={submit}><span className="eyebrow">{panel === "kds" ? "Kitchen Staff" : `${panel[0].toUpperCase()}${panel.slice(1)} Panel`}</span><h1>Sign in</h1><p>Use your panel account to continue.</p><label>Username<input value={username} onChange={(event) => setUsername(event.target.value)} /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="error-text">{error}</p>}<button className="primary" type="submit">Open Panel</button><small>Demo: customer/customer123, kitchen/kitchen123, admin/admin123</small></form></main>;
}

function OrderTracking({ order }) {
  const steps = ["received", "preparing", "ready"];
  return <section className="tracking-panel"><div><span className="eyebrow">Order tracking</span><h2>Table {order.tableNo}</h2><p>Order {order.id.slice(0, 8)}</p></div><div className="tracking-steps">{steps.map((step) => <div className={steps.indexOf(step) <= steps.indexOf(order.status) ? "tracking-step complete" : "tracking-step"} key={step}><strong>{statusLabels[step]}</strong></div>)}</div></section>;
}

function PanelHeader({ panel, loadData }) {
  const copy = {
    customer: {
      label: "Customer Panel",
      title: "Order Food",
      body: "Browse the menu, add items, pay with UPI, and send the order straight to the kitchen."
    },
    kds: {
      label: "Kitchen Display",
      title: "Live KDS Panel",
      body: "Kitchen staff can move orders from received to preparation and ready to serve."
    },
    admin: {
      label: "Admin Panel",
      title: "Restaurant Control",
      body: "Track tables, payments, order history, revenue, and preparation performance."
    }
  };

  return (
    <>
      <header className={`hero ${panel}-hero`}>
        <div>
          <span className="eyebrow">{copy[panel].label}</span>
          <h1>{copy[panel].title}</h1>
          <p>{copy[panel].body}</p>
        </div>
        <button className="ghost" onClick={loadData}>
          <RefreshCw size={18} /> Refresh
        </button>
      </header>

    </>
  );
}

function CustomerPanel({
  bookedTables,
  cart,
  cartItems,
  cartTotal,
  categories,
  chooseSmartNeed,
  customerName,
  filteredMenu,
  listening,
  notes,
  paymentQr,
  searchText,
  selectedCategory,
  setCustomerName,
  setNotes,
  setSearchText,
  setSelectedCategory,
  setTableNo,
  startVoiceOrder,
  submitOrder,
  tableNo,
  tableStatuses,
  updateCart,
  voiceText,
  emptyTables
}) {
  return (
    <>
      <section className="tables-section customer-tables">
        <div className="table-summary">
          <Metric label="Total Tables" value={restaurantTables.length} />
          <Metric label="Booked Tables" value={bookedTables} />
          <Metric label="Empty Tables" value={emptyTables} />
        </div>

        <div className="table-grid">
          {tableStatuses.map((item) => (
            <article className={`table-card ${item.status} ${item.table === tableNo ? "selected" : ""}`} key={item.table}>
              <div className="table-icon">
                {item.status === "booked" ? <Users size={22} /> : <CheckCircle2 size={22} />}
              </div>
              <div>
                <h2>{item.table}</h2>
                <b>{item.status === "booked" ? "Booked" : "Empty"}</b>
                {item.order ? <p>{statusLabels[item.order.status]} | Rs. {item.order.total}</p> : <p>Available for new order</p>}
              </div>
              <button onClick={() => setTableNo(item.table)}>
                {item.table === tableNo ? "Selected" : "Select Table"}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="order-layout">
        <div>
          <div className="menu-controls">
            <input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search biryani, dessert, dosa..." />
            <div className="category-chips">
              {categories.map((category) => (
                <button className={selectedCategory === category ? "active" : ""} key={category} onClick={() => setSelectedCategory(category)}>
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="menu-grid">
            {filteredMenu.length ? filteredMenu.map((item) => (
              <article className="menu-card" key={item.id}>
                <div>
                  <span>{item.category}</span>
                  <h2>{item.name}</h2>
                  <p>{item.prepMinutes} min prep</p>
                </div>
                <strong>Rs. {item.price}</strong>
                <div className="stepper">
                  <button aria-label={`Remove ${item.name}`} onClick={() => updateCart(item.id, -1)}><Minus size={16} /></button>
                  <b>{cart[item.id] || 0}</b>
                  <button aria-label={`Add ${item.name}`} onClick={() => updateCart(item.id, 1)}><Plus size={16} /></button>
                </div>
              </article>
            )) : <p className="empty">Menu is loading...</p>}
          </div>
        </div>

        <aside className="cart-panel">
          <h2>Your Order</h2>
          <label>Table No<input value={tableNo} onChange={(event) => setTableNo(event.target.value)} /></label>
          <label>Name<input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Optional" /></label>
          <button className={listening ? "voice listening" : "voice"} onClick={startVoiceOrder}>
            {listening ? <Volume2 size={18} /> : <Mic size={18} />} {listening ? "Listening..." : "Voice Order"}
          </button>
          <div className="smart-panel">
            <div className="smart-title"><Sparkles size={16} /> Suggestions</div>
            <div className="smart-chips">
              {smartNeeds.map((need) => (
                <button key={need.label} onClick={() => chooseSmartNeed(need)}><Lightbulb size={14} /> {need.label}</button>
              ))}
            </div>
          </div>
          {voiceText && <p className="voice-text">"{voiceText}"</p>}
          <div className="cart-items">
            {cartItems.length ? cartItems.map((item) => (
              <p key={item.id}><span>{item.quantity} x {item.name}</span><b>Rs. {item.price * item.quantity}</b></p>
            )) : <p>No items selected.</p>}
          </div>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Kitchen notes" />
          <div className="total"><span>Total</span><strong>Rs. {cartTotal}</strong></div>
          <div className="payment-panel">
            <div className="payment-title"><Wallet size={16} /> UPI Payment</div>
            <p><span>UPI ID</span><b>{UPI_ID}</b></p>
            <p><span>Amount</span><b>Rs. {cartTotal}</b></p>
            {paymentQr ? <img src={paymentQr} alt="UPI payment QR code" /> : <div className="qr-placeholder"><QrCode size={44} /> Add items to generate QR</div>}
            <small>Scan with any UPI app after selecting items.</small>
          </div>
          <button className="pay-button" onClick={() => submitOrder(true)}><Wallet size={18} /> Pay & Send Order</button>
          <button className="primary" onClick={() => submitOrder(false)}><Send size={18} /> Send to Kitchen</button>
        </aside>
      </section>
    </>
  );
}

function KdsPanel({ changeStatus, orders }) {
  const [filter, setFilter] = useState("all");
  const [muted, setMuted] = useState(false);
  const visibleOrders = filter === "all" ? orders : orders.filter((order) => order.status === filter);
  useEffect(() => {
    if (muted || !orders.some((order) => order.status === "received")) return;
    const audio = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=");
    audio.play().catch(() => {});
  }, [orders, muted]);
  return (
    <section className="kds-board">
      <div className="kds-controls"><strong>Kitchen queue</strong><select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All orders</option><option value="received">Received</option><option value="preparing">In Preparation</option><option value="ready">Ready</option></select><button className="ghost" onClick={() => setMuted((value) => !value)}>{muted ? "Enable sound" : "Mute sound"}</button></div>
      {["received", "preparing", "ready"].map((status) => (
        <div className="lane" key={status}>
          <h2>{statusLabels[status]}</h2>
          {visibleOrders.filter((order) => order.status === status).map((order) => (
            <OrderCard key={order.id} order={order} onAdvance={() => nextStatus[order.status] && changeStatus(order, nextStatus[order.status])} />
          ))}
          {!visibleOrders.some((order) => order.status === status) && <p className="empty lane-empty">No orders in this stage.</p>}
        </div>
      ))}
    </section>
  );
}

function AdminPanel({ analytics, bookedTables, emptyTables, orders, payments, tableStatuses, menu, apiFetch, loadData }) {
  const [adminTab, setAdminTab] = useState("dashboard");

  function exportReport() {
    const rows = [["Order ID", "Table", "Status", "Total", "Created At"], ...orders.map((order) => [order.id, order.tableNo, order.status, order.total, order.createdAt])];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "restaurant-orders.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <section className="admin-shell">
      <nav className="tabs">
        <button className={adminTab === "dashboard" ? "active" : ""} onClick={() => setAdminTab("dashboard")}><BarChart3 size={18} /> Dashboard</button>
        <button className={adminTab === "tables" ? "active" : ""} onClick={() => setAdminTab("tables")}><Armchair size={18} /> Tables</button>
        <button className={adminTab === "history" ? "active" : ""} onClick={() => setAdminTab("history")}><History size={18} /> History</button>
        <button className={adminTab === "menu" ? "active" : ""} onClick={() => setAdminTab("menu")}>Menu</button>
      </nav>

      {adminTab === "dashboard" && (
        <section className="dashboard">
          <div className="wide report-actions"><h2>Reports</h2><p>Export order data for accounting and daily review.</p><button className="primary" onClick={exportReport}>Download CSV</button></div>
          <Metric label="Total Orders" value={analytics?.totalOrders || 0} />
          <Metric label="Active Orders" value={analytics?.activeOrders || 0} />
          <Metric label="Payments" value={analytics?.totalPayments || 0} />
          <Metric label="Revenue" value={`Rs. ${analytics?.revenue || 0}`} />
          <Metric label="Avg Prep" value={`${analytics?.averagePrepMinutes || 0} min`} />
          <Metric label="Empty Tables" value={emptyTables} />
          <div className="wide">
            <h2>Popular Dishes</h2>
            {(analytics?.popularItems || []).map((item) => <p key={item.name}><span>{item.name}</span><b>{item.quantity}</b></p>)}
          </div>
          <div className="wide">
            <h2>Live Kitchen Orders</h2>
            {orders.filter((order) => order.status !== "ready").length ? orders.filter((order) => order.status !== "ready").slice(0, 8).map((order) => (
              <p key={order.id}>
                <span>{order.tableNo} - {order.items.map((item) => `${item.quantity} x ${item.name}`).join(", ")}</span>
                <b>{statusLabels[order.status]}</b>
              </p>
            )) : <p className="empty">No active kitchen orders.</p>}
          </div>
          <div className="wide">
            <h2>Recent Orders</h2>
            {orders.slice(0, 8).map((order) => <p key={order.id}><span>{order.tableNo} - {order.items.map((item) => item.name).join(", ")}</span><b>{statusLabels[order.status]}</b></p>)}
          </div>
        </section>
      )}

      {adminTab === "tables" && (
        <section className="tables-section">
          <div className="table-summary">
            <Metric label="Total Tables" value={restaurantTables.length} />
            <Metric label="Booked Tables" value={bookedTables} />
            <Metric label="Empty Tables" value={emptyTables} />
          </div>

          <div className="table-grid">
            {tableStatuses.map((item) => (
              <article className={`table-card ${item.status}`} key={item.table}>
                <div className="table-icon">
                  {item.status === "booked" ? <Users size={22} /> : <CheckCircle2 size={22} />}
                </div>
                <div>
                  <h2>{item.table}</h2>
                  <b>{item.status === "booked" ? "Booked" : "Empty"}</b>
                  {item.order ? <p>{statusLabels[item.order.status]} | Rs. {item.order.total}</p> : <p>Available for new order</p>}
                </div>
                <span className="pill">Admin View</span>
              </article>
            ))}
          </div>
        </section>
      )}

      {adminTab === "history" && (
        <section className="history-layout">
          <div className="history-panel">
            <h2>Order History</h2>
            {orders.length ? orders.map((order) => (
              <article className="history-row" key={order.id}>
                <div>
                  <strong>{order.tableNo} - Rs. {order.total}</strong>
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                  <p>{order.items.map((item) => `${item.quantity} x ${item.name}`).join(", ")}</p>
                </div>
                <b className={`pill ${order.status}`}>{statusLabels[order.status]}</b>
              </article>
            )) : <p className="empty">No orders saved yet.</p>}
          </div>

          <div className="history-panel">
            <h2>Payment History</h2>
            {payments.length ? payments.map((payment) => (
              <article className="history-row" key={payment.id}>
                <div>
                  <strong>{payment.tableNo} - Rs. {payment.amount}</strong>
                  <span>{new Date(payment.paidAt).toLocaleString()}</span>
                  <p>{payment.method} | {payment.upiId} | {payment.transactionRef}</p>
                </div>
                <b className="pill ready">{payment.status}</b>
              </article>
            )) : <p className="empty">No payments saved yet.</p>}
          </div>
        </section>
      )}
      {adminTab === "menu" && <MenuManager menu={menu} apiFetch={apiFetch} loadData={loadData} />}
    </section>
  );
}

function MenuManager({ menu, apiFetch, loadData }) {
  const [draft, setDraft] = useState({ name: "", category: "Biryani", price: 0, prepMinutes: 10, available: true });
  async function addItem(event) {
    event.preventDefault();
    await apiFetch("/api/menu", { method: "POST", body: JSON.stringify(draft) });
    setDraft({ name: "", category: "Biryani", price: 0, prepMinutes: 10, available: true });
    loadData();
  }
  async function toggle(item) {
    await apiFetch(`/api/menu/${item.id}`, { method: "PATCH", body: JSON.stringify({ available: !item.available }) });
    loadData();
  }
  return <section className="menu-manager"><form className="menu-form" onSubmit={addItem}><h2>Add menu item</h2><input placeholder="Dish name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required /><input placeholder="Category" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} /><input type="number" min="1" placeholder="Price" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} /><input type="number" min="1" placeholder="Prep minutes" value={draft.prepMinutes} onChange={(event) => setDraft({ ...draft, prepMinutes: event.target.value })} /><button className="primary">Add item</button></form><div className="menu-admin-list">{menu.map((item) => <article className="history-row" key={item.id}><div><strong>{item.name}</strong><span>{item.category} | Rs. {item.price} | {item.prepMinutes} min</span></div><button className="ghost" onClick={() => toggle(item)}>{item.available ? "Mark unavailable" : "Make available"}</button></article>)}</div></section>;
}

function OrderCard({ order, onAdvance }) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(order.createdAt)) / 60000));
  return (
    <article className={`order-card ${order.status}`}>
      <div className="order-head">
        <strong>{order.tableNo}</strong>
        <span><Clock size={14} /> {minutes} min</span>
      </div>
      {order.customerName && <small>{order.customerName}</small>}
      {order.items.map((item) => <p key={item.menuItemId}>{item.quantity} x {item.name}</p>)}
      {order.notes && <small>{order.notes}</small>}
      {nextStatus[order.status] && <button onClick={onAdvance}>{statusLabels[nextStatus[order.status]]}</button>}
    </article>
  );
}

function Metric({ label, value }) {
  return <article className="metric"><span>{label}</span><strong>{value}</strong></article>;
}
