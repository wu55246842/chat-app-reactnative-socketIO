const io = require("socket.io-client");

// 连接到你的 Socket.IO 服务器
const socket = io("https://app.skodaclub.sg", {
  path: "/socket.io", // 确保路径正确
  transports: ["websocket"], // 使用 WebSocket 传输
  secure: true, // 使用 HTTPS 连接
  reconnectionAttempts: 3, // 连接失败时重试的次数
  timeout: 5000, // 超时时间
});

// 当连接成功时
socket.on("connect", () => {
  console.log("Connected to server!");

  // 测试：创建一个房间
  socket.emit("createRoom", "Test Room");

  // 测试：获取房间信息
  socket.emit("findRoom", 1); // 假设房间ID为1
});

// 当接收到房间列表时
socket.on("roomsList", (rooms) => {
  console.log("Rooms List:", rooms);
});

// 当接收到房间消息时
socket.on("foundRoom", (messages) => {
  console.log("Room Messages:", messages);
});

// 当接收到新消息时
socket.on("roomMessage", (message) => {
  console.log("New Message:", message);
});

// 当连接断开时
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

// 处理连接错误
socket.on("connect_error", (err) => {
  console.error("Connection error:", err);
});
