import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import useDebounce from '../hooks/useDebounce';

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

  &:disabled {
    background-color: grey;
    cursor: not-allowed;
  }
`;

const Title = styled.h1`
  color: #333;
`;

const Message = styled.p`
  font-size: 14px;
  color: ${(props) => (props.$isValid ? 'green' : 'red')}; // $isValid로 수정
`;

function Signup() {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState('');
  const [isIdTaken, setIsIdTaken] = useState(false); // 아이디 중복 확인
  const [isCheckingId, setIsCheckingId] = useState(false); // 중복 확인 중 상태
  const [isCheckingPw, setIsCheckingPw] = useState(false); // 중복 확인 중 상태
  const debouncedId = useDebounce(id, 350); // useDebounce 사용

  const idRef = useRef();
  const mailRef = useRef();
  const pwRef = useRef();
  const pwValidRef = useRef();

  useEffect(() => {
    if (id) {
      setIsCheckingId(true); // 타이핑이 시작되면 즉시 true로 설정
    }
  }, [id]);

  useEffect(() => {
    if (password && passwordValid) {
        if(password.trim() === passwordValid.trim()){
          setIsCheckingPw(true)
        }else{
          setIsCheckingPw(false)
        }
    }
  }, [password, passwordValid]);

  useEffect(() => {
    if (debouncedId && debouncedId.trim() !== '') {
      const checkId = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/users/check-id/${debouncedId}`);
          setIsIdTaken(response.data.isTaken);
        } catch (error) {
          console.error('아이디 중복 확인 중 오류:', error);
        } finally {
          setIsCheckingId(false); // API 요청이 완료되면 false로 설정
        }
      };
      checkId();
    }
  }, [debouncedId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(id.trim() === "") {
      idRef.current.focus();
      return alert("아이디를 입력해주세요");
    }

    if(email.trim() === "") {
      mailRef.current.focus();
      return alert("이메일을 입력해주세요");
    }

    if(password.trim() === "") {
      pwRef.current.focus();
      return alert("비밀번호를 입력해주세요");
    }

    if(passwordValid.trim() === "") {
      pwValidRef.current.focus();
      return alert("비밀번호 확인이 필요합니다.");
    }

    if(isCheckingPw === false) {
      pwValidRef.current.focus();
      return alert("비밀번호 확인이 필요합니다.");
    }

    if(passwordValid.trim() !== password.trim()) {
      pwRef.current.focus();
      return alert("비밀번호가 일치하지 않습니다.");
    }

    if (isIdTaken) {
      return alert("이미 사용 중인 아이디입니다.");
    }

    try {
      const response = await axios.post('http://localhost:4000/users', {
        id,
        email,
        password,
      });
      if (response.status === 201) {
        alert('회원가입 성공');
      } else {
        alert('회원가입 실패');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('회원가입 실패');
    }
  };

  return (
    <Container>
      <Title>회원가입</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <label>아이디</label>
          <Input
            ref={idRef}
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
         {id && (
            isCheckingId ? (
              <Message>아이디 확인 중...</Message>
            ) : isIdTaken ? (
              <Message $isValid={false}>이미 사용 중인 아이디입니다.</Message>
            ) : (
              <Message $isValid={true}>사용 가능한 아이디입니다.</Message>
            )
          )}
        </FormGroup>
        <FormGroup>
          <label>이메일</label>
          <Input ref={mailRef} type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <label>비밀번호</label>
          <Input ref={pwRef} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <label>비밀번호 확인</label>
          <Input ref={pwValidRef} type="password" value={passwordValid} onChange={(e) => setPasswordValid(e.target.value)} />
        </FormGroup>
        {password && passwordValid && (
            isCheckingPw ? (
              <Message $isValid={true}>비밀번호 확인이 일치합니다.</Message>
            ) : (
              <Message $isValid={false}>비밀번호 확인이 필요합니다.</Message>
            )
          )}
        <Button type="submit" disabled={isIdTaken}>
          회원가입
        </Button>
      </Form>
    </Container>
  );
}

export default Signup;
