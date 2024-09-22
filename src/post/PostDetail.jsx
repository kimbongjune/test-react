import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const Title = styled.h1`
  color: #333;
`;

const Content = styled.p`
  font-size: 16px;
  color: #555;
`;

const Message = styled.p`
  font-size: 18px;
  color: #888;
`;

function PostDetail({ isLoggedIn }) {
  const { id } = useParams(); // URL에서 게시글 ID를 가져옴
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // API 호출
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/boards/${id}`);
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        setError('게시글을 가져오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (!isLoggedIn) {
    return <Message>로그인 후 게시글을 볼 수 있습니다.</Message>;
  }

  if (loading) {
    return <Message>로딩 중...</Message>;
  }

  if (error) {
    return <Message>{error}</Message>;
  }

  if (!post) {
    return <Message>게시글을 찾을 수 없습니다.</Message>;
  }

  return (
    <div>
      <Title>{post.title}</Title>
      <Content>{post.content}</Content>
    </div>
  );
}

export default PostDetail;
