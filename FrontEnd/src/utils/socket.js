import { io } from "socket.io-client";

// Replace with your backend WebSocket URL if different
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: false, // We'll connect manually after auth
  transports: ["websocket"],
});

export default socket;
