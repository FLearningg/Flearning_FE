import { io } from "socket.io-client";

// Replace with your backend WebSocket URL if different
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: false, // We'll connect manually after auth
  // Allow fallback transports for Azure compatibility
  transports: ["websocket", "polling"],

  // Timeouts and retry configuration
  timeout: 20000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,

  // Force new connection to avoid sticky session issues
  forceNew: true,

  // Additional options for Azure compatibility
  upgrade: true,
  rememberUpgrade: false,

  // CORS and headers
  withCredentials: true,

  // Query parameters for debugging
  query: {
    transport: "websocket",
  },
});

// Debug events for troubleshooting
if (process.env.NODE_ENV === "development") {
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    console.log("Transport:", socket.io.engine.transport.name);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.log("Socket connection error:", error);
  });

  socket.io.on("error", (error) => {
    console.log("Socket.io error:", error);
  });
}

export default socket;
