const express = require('express');
const { User, Board } = require('./db/database');
const app = express();
const cors = require('cors');

app.use(express.json()); // JSON 요청 본문 처리
app.use(cors());

// 1. 모든 사용자 가져오기
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      include: Board // 사용자가 작성한 게시글까지 포함
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: '사용자를 가져오는 중 오류 발생' });
  }
});

// 2. 특정 사용자 가져오기
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: Board
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
  } catch (error) {
    res.status(500).json({ error: '사용자를 가져오는 중 오류 발생' });
  }
});

// 회원가입
app.post('/users', async (req, res) => {
    const { id, email, password } = req.body;
    try {
      const newUser = await User.create({ id, email, password });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ error: '회원가입 중 오류 발생' });
    }
  });

  // 로그인
app.post('/users/login', async (req, res) => {
    const { id, password } = req.body;
    try {
      const user = await User.findOne({ where: { id, password } });
      if (user) {
        res.status(200).json({ message: '로그인 성공', user });
      } else {
        res.status(401).json({ error: '로그인 실패' });
      }
    } catch (error) {
      res.status(500).json({ error: '로그인 중 오류 발생' });
    }
  });

// 4. 게시글 생성하기
app.post('/boards', async (req, res) => {
  const { title, content, userId } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    const newBoard = await Board.create({ title, content, UserId: userId });
    res.status(201).json(newBoard);
  } catch (error) {
    res.status(400).json({ error: '게시글 생성 중 오류 발생' });
  }
});

app.get('/users/check-id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ where: { id } });
    if (user) {
      return res.json({ isTaken: true });
    }
    res.json({ isTaken: false });
  } catch (error) {
    res.status(500).json({ error: '아이디 확인 중 오류가 발생했습니다.' });
  }
});

// 5. 모든 게시글 가져오기
app.get('/boards', async (req, res) => {
  try {
    const boards = await Board.findAll({
      include: User
    });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: '게시글을 가져오는 중 오류 발생' });
  }
});

app.get('/boards/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const board = await Board.findByPk(id, { include: User });
      if (!board) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }
      res.json(board);
    } catch (error) {
      res.status(500).json({ error: '게시글을 가져오는 중 오류가 발생했습니다.' });
    }
  });

// 서버 실행
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
