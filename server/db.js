const { Sequelize, DataTypes } = require('sequelize');

// 创建 Sequelize 实例
// const sequelize = new Sequelize('skodaclu_app_mobile', 'skodaclu_app_mobile', 'aZ?dQj26e];i', {
//   host: '117.120.7.38',
//   port: '3306',
//   dialect: 'mysql',
// });

const sequelize = new Sequelize('skodaclu_app_mobile', 'root', 'Laowudi2023Go!', {
  host: '165.22.62.0',
  port: '36693',
  dialect: 'mysql',
});

// 定义 ChatRoom 模型
const ChatRoom = sequelize.define('ChatRoom', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  memberLevelId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'member_level_id', // 映射数据库字段
  },
  remark: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  delFlag: {
    type: DataTypes.TINYINT,
    allowNull: true,
    field: 'del_flag', // 映射数据库字段
  },
}, {
  tableName: 'ums_chat_room',
  timestamps: false,
});

// 定义 ChatMessage 模型
const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  memberId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'member_id', // 映射数据库字段
  },
  roomId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'room_id', // 映射数据库字段
  },
  message: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pic: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createBy: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'create_by', // 映射数据库字段
  },
  createTime: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'create_time', // 映射数据库字段
  },
  updateBy: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'update_by', // 映射数据库字段
  },
  updateTime: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'update_time', // 映射数据库字段
  },
  delFlag: {
    type: DataTypes.TINYINT,
    allowNull: true,
    field: 'del_flag', // 映射数据库字段
  },
}, {
  tableName: 'ums_chat_message',
  timestamps: false,
});

// 建立关联
ChatRoom.hasMany(ChatMessage, { foreignKey: 'roomId', sourceKey: 'id' });
ChatMessage.belongsTo(ChatRoom, { foreignKey: 'roomId', targetKey: 'id' });

// 同步模型
sequelize.sync();

module.exports = {
  sequelize,
  ChatRoom,
  ChatMessage,
};
