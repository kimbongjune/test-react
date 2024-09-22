import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const PostItem = styled.li`
  list-style: none;
  margin-bottom: 10px;
`;

const PostLink = styled(Link)`
  color: #007bff;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  color: #333;
`;

const Message = styled.p`
  font-size: 18px;
  color: #888;
`;

function PostList({ isLoggedIn }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // API 호출
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/boards');
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        setError('게시글을 가져오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (!isLoggedIn) {
    return <Message>로그인 후 게시글을 볼 수 있습니다.</Message>;
  }

  if (loading) {
    return <Message>로딩 중...</Message>;
  }

  if (error) {
    return <Message>{error}</Message>;
  }

  return (
    <div>
      <Title>게시글 목록</Title>
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <PostItem key={post.id}>
              <PostLink to={`/post/${post.id}`}>{post.title}</PostLink>
            </PostItem>
          ))}
        </ul>
      ) : (
        <Message>게시글이 없습니다.</Message>
      )}
    </div>
  );
}

export default PostList;
