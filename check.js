// verify.js
const { io } = require("socket.io-client");

const socket = io("ws://localhost:8080/controls", {
  transports: ["websocket"],
  reconnection: true,
});

socket.on("connect", () => {
  console.log("✅ Connected to WebSocket");
  console.log("Socket ID:", socket.id);
});

socket.on("controls.section.started", (payload) => {
  console.log("🚀 Control started section event received:");
  console.log(payload);
});

socket.on("controls.section.finished", (payload) => {
  console.log("🚀 Control ended section event received:");
  console.log(payload);
});

socket.on("controls.session.started", (payload) => {
  console.log("🚀 Control started session event received:");
  console.log(payload);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from WebSocket");
});

socket.on("connect_error", (err) => {
  console.error("⚠️ Connection error:", err.message);
});
