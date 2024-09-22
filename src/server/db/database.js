const { Sequelize, DataTypes } = require('sequelize');

// SQLite 데이터베이스 설정
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

// User 모델 정의
const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Board 모델 정의
const Board = sequelize.define('Board', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, // 자동 증가
        primaryKey: true     // 기본 키 설정
    },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

// User와 Board의 관계 정의
User.hasMany(Board, { onDelete: 'CASCADE' });
Board.belongsTo(User);

// 데이터베이스 동기화
sequelize.sync({ force: true }) // 개발 중에만 force: true로 설정
  .then(() => {
    console.log('모델이 성공적으로 동기화되었습니다.');
  })
  .catch(error => {
    console.error('데이터베이스 동기화 중 오류 발생:', error);
  });

module.exports = {
  sequelize,
  User,
  Board
};
