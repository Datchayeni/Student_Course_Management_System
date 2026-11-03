import { io } from "socket.io-client";
import { getToken } from "./apiClient";

export function createSocket() {
  const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
  
  return io(socketUrl, {
    autoConnect: false,
    auth: {
      token: getToken()
    }
  });
}