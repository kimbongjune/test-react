import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import PostList from './post/PostList';
import PostDetail from './post/PostDetail';
import PostCreate from './post/PostCreate';
import Signup from './user/Signup';
import Login from './user/Login';

const Nav = styled.nav`
  background-color: #333;
  padding: 10px;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: 10px;
  padding: 0;
  margin: 0px;
`;

const NavItem = styled.li`
  display: inline;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  background-color: #555;
  border-radius: 5px;

  &:hover {
    background-color: #777;
  }
`;
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };

  const logout = () => {
    setIsLoggedIn(false)
    navigate('/posts');
  }

  return (
    <>
      <Nav>
      <NavList>
          {!isLoggedIn ? (
            <>
              <NavItem>
                <NavLink to="/">로그인</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/signup">회원가입</NavLink>
              </NavItem>
            </>
          ) : (
            <>
              <NavItem>
                <NavLink to="/posts">게시글 목록</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/create">게시글 작성</NavLink>
              </NavItem>
              <NavItem>
                <button onClick={logout}>로그아웃</button>
              </NavItem>
            </>
          )}
        </NavList>
      </Nav>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        {isLoggedIn && (
          <>
            <Route path="/posts" element={<PostList isLoggedIn={isLoggedIn} />} />
            <Route path="/post/:id" element={<PostDetail isLoggedIn={isLoggedIn} />} />
            <Route path="/create" element={<PostCreate isLoggedIn={isLoggedIn} />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
