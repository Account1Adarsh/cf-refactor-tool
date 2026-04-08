import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
  
  span {
    color: ${({ theme }) => theme.accent};
  }
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.textMuted};
  font-size: 1.1rem;
`;

const Header = () => {
    return (
        <HeaderContainer>
            <Title>Codeforces <span>Refactor</span></Title>
            <Subtitle>Enhance and analyze your C++ solutions effortlessly.</Subtitle>
        </HeaderContainer>
    );
};

export default Header;
