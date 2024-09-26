const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const { sequelize, ChatRoom, ChatMessage } = require('./db'); // 导入 Sequelize 配置和模型
const PORT = 4000;
const socketIO = require("socket.io")(http, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "https://app.skodaclub.sg",
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const generateID = () => Math.random().toString(36).substring(2, 10);
let chatRooms = [];

// 从数据库加载现有的房间信息
const loadChatRooms = async () => {
  chatRooms = await ChatRoom.findAll({
    where: { delFlag: 0 },
    include: [ChatMessage],
  });
};

loadChatRooms();

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("createRoom", async (name) => {
    const newRoom = await ChatRoom.create({
      name,
      memberLevelId: '',
      remark: '',
      delFlag: 0,
    });
    chatRooms.unshift(newRoom);
    socket.emit("roomsList", chatRooms);
  });

  socket.on("findRoom", async (roomId) => {
    const room = await ChatRoom.findByPk(roomId, {
      include: [ChatMessage],
    });
    if (room) {
      socket.join(roomId); 
      socket.emit("foundRoom", room.ChatMessages);
    }
  });

  socket.on("newMessage", async (data) => {
      console.log('******************************');
      console.log(data);
      const { roomId, message, memberId, pic } = data;

      const newMessage = await ChatMessage.create({
          memberId: memberId,
          roomId: roomId,
          message: message,
          createBy: memberId,
          createTime: new Date(),
          pic: pic,
          delFlag: 0,
      });

      // 确保找到房间并加入
      const room = await ChatRoom.findByPk(roomId);
      if (room) {
          console.log(room,roomId)
          socket.to(roomId).emit("roomMessage", newMessage); // 广播新消息到房间内的所有客户端
          socket.emit("foundRoom", room.ChatMessages); // 向当前客户端发送更新后的消息列表
      }
  });



  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});

//获取房间以及房间的聊天记录
app.get("/chat/get", async (req, res) => {
  const rooms = await ChatRoom.findAll({
    where: { delFlag: 0 },
    include: [ChatMessage],
  });
  res.json(rooms);
});

//只获取房间
app.get("/chat/getRooms", async (req, res) => {
  const rooms = await ChatRoom.findAll({
    where: { delFlag: 0 }
  });
  res.json(rooms);
});
//获取房间的聊天记录（两周内）
app.get("/chat/getMessages", async (req, res) => {
  const rooms = await ChatRoom.findAll({
    where: { delFlag: 0 },
    include: [ChatMessage],
  });
  res.json(rooms);
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
