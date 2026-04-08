import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 4px solid ${({ theme }) => theme.border};
  border-top: 4px solid ${({ theme }) => theme.accent};
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto 1rem auto;
`;

const Container = styled.div`
  background: ${({ theme }) => theme.cardBg};
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.accent};
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding-bottom: 0.5rem;
`;

const Statement = styled.div`
  background: ${({ theme }) => theme.darkBg};
  padding: 1.5rem;
  border-radius: 8px;
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
  color: ${({ theme }) => theme.text};
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  font-size: 0.95rem;
  border: 1px solid ${({ theme }) => theme.border};
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border};
    border-radius: 4px;
  }
`;

const LinksList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LinkItem = styled.li`
  a {
    color: ${({ theme }) => theme.accent};
    text-decoration: none;
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    background: ${({ theme }) => theme.darkBg};
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme.border};
    transition: all 0.2s;
    word-break: break-all;

    &:hover {
      border-color: ${({ theme }) => theme.accent};
      background: rgba(59, 130, 246, 0.05);
      transform: translateX(4px);
    }
  }
`;

const Message = styled.div`
  padding: 2rem;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  text-align: center;
  color: ${({ theme }) => theme.textMuted};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const ErrorMessage = styled(Message)`
  color: ${({ theme }) => theme.danger};
`;

export default function ProblemMeta({ cfId }) {
  const [meta, setMeta]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!cfId) return;
    setLoading(true);
    setError('');
    axios
      .get(`https://cf-refactor-backend.onrender.com/api/solutions/problems/${cfId}/meta/`)
      .then(res => {
        if (res.data.error) throw new Error(res.data.error);
        setMeta(res.data);
      })
      .catch(err => {
        console.error(err);
        setError(err.response?.data?.error || err.message || 'Failed to analyze the problem. Please verify the ID and try again.');
      })
      .finally(() => setLoading(false));
  }, [cfId]);

  if (loading) return (
    <Message>
      <Spinner />
      <p>Analyzing problem statement and fetching top submissions...</p>
    </Message>
  );
  
  if (error) return (
    <ErrorMessage>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
      <p>{error}</p>
    </ErrorMessage>
  );
  
  if (!meta) return null;

  return (
    <Container>
      <Title>Problem Statement: {cfId}</Title>
      <Statement>{meta.problem_statement}</Statement>
      
      <Title as="h3" style={{ marginTop: '2rem', fontSize: '1.25rem', borderBottom: 'none' }}>
        Top C++ Submissions
      </Title>
      <LinksList>
        {meta.submission_links.map((url, i) => (
          <LinkItem key={i}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              🔗 {url}
            </a>
          </LinkItem>
        ))}
      </LinksList>
    </Container>
  );
}
