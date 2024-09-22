import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  font-size: 16px;
`;

const Textarea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const Title = styled.h1`
  color: #333;
`;

function PostCreate({ isLoggedIn }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/boards', {
        title,
        content,
        userId: 1, // 임시로 userId 1로 설정 (API에 맞게 조정)
      });
      if (response.status === 201) {
        alert('게시글이 성공적으로 작성되었습니다.');
        navigate(`/post/${response.data.id}`); // 게시글 목록 페이지로 이동
      }
    } catch (error) {
      console.error('게시글 작성 중 오류 발생:', error);
      alert('게시글 작성에 실패했습니다.');
    }
  };

  if (!isLoggedIn) {
    return <p>로그인 후 게시글을 작성할 수 있습니다.</p>;
  }

  return (
    <Container>
      <Title>게시글 작성</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <label>제목</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>내용</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </FormGroup>
        <Button type="submit">작성</Button>
      </Form>
    </Container>
  );
}

export default PostCreate;
