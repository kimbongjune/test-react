import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
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

function Login({ onLogin }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/users/login', {
        id,
        password,
      });
      if (response.status === 200) {
        onLogin(true);
        navigate('/posts');
      } else {
        alert('로그인 실패');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인 실패');
    }
  };

  return (
    <Container>
      <Title>로그인</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <label>아이디</label>
          <Input type="text" value={id} onChange={(e) => setId(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <label>비밀번호</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormGroup>
        <Button type="submit">로그인</Button>
      </Form>
    </Container>
  );
}

export default Login;
