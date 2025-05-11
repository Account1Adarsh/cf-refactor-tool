// src/components/ProblemMeta.js
import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  background: ${({ theme }) => theme.darkBg};
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.accent};
`;

const Statement = styled.pre`
  background: #2b2b2b;
  padding: 1rem;
  border-radius: 6px;
  white-space: pre-wrap;
  max-height: 300px;
  overflow: auto;
  color: ${({ theme }) => theme.text};
`;

const LinksList = styled.ul`
  list-style: none;
  padding: 0;
`;

const LinkItem = styled.li`
  margin: 0.5rem 0;
  a {
    color: ${({ theme }) => theme.accent};
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Message = styled.div`
  padding: 1rem;
  background: #333;
  border-radius: 6px;
  text-align: center;
  color: ${({ theme }) => theme.text};
`;

export default function ProblemMeta({ cfId }) {
  const theme = useTheme();
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
        setError(err.response?.data?.error || err.message);
      })
      .finally(() => setLoading(false));
  }, [cfId]);

  if (loading) return <Message>Loading problem statement…</Message>;
  if (error)   return <Message>Error: {error}</Message>;
  if (!meta)  return null;

  return (
    <Container>
      <Title>Problem {cfId}</Title>
      <Statement>{meta.problem_statement}</Statement>

      <Title as="h3">Top C++ Submissions</Title>
      <LinksList>
        {meta.submission_links.map((url, i) => (
          <LinkItem key={i}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
          </LinkItem>
        ))}
      </LinksList>
    </Container>
  );
}
