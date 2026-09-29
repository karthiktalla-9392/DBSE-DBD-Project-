import { randomBytes } from "node:crypto";

const users = [
  { username: "customer", password: "customer123", role: "customer", name: "Customer" },
  { username: "kitchen", password: "kitchen123", role: "kds", name: "Kitchen Staff" },
  { username: "admin", password: "admin123", role: "admin", name: "Administrator" }
];
const sessions = new Map();

export function login(username, password) {
  const user = users.find((candidate) => candidate.username === username && candidate.password === password);
  if (!user) return null;
  const token = randomBytes(24).toString("hex");
  const session = { token, username: user.username, role: user.role, name: user.name };
  sessions.set(token, session);
  return session;
}

export function requireRole(...roles) {
  return (request, response, next) => {
    const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
    const session = token ? sessions.get(token) : null;
    if (!session || (roles.length && !roles.includes(session.role))) {
      return response.status(401).json({ message: "Sign in with an authorized account." });
    }
    request.user = session;
    next();
  };
}
