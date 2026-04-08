import React, { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: ${({ theme }) => theme.cardBg};
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.accent};
  }
`;

const Label = styled.label`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.textMuted};
  font-weight: 500;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 1rem 1.25rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.darkBg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.accent};
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  &::placeholder {
    color: ${({ theme }) => theme.border};
  }
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.danger};
  font-size: 0.9rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  
  &::before {
    content: "⚠️";
  }
`;

export default function ProblemInput({ setCfId, onSubmitted }) {
  const [inputCfId, setInputCfId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputCfId.trim()) {
      setError('Please enter a valid Codeforces Problem ID (e.g., 158A).');
      return;
    }
    setError('');
    setCfId(inputCfId.trim());
    onSubmitted();  // Signal the parent to show ProblemMeta + CodeRefactor
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Label>Enter Codeforces Problem ID</Label>
      <InputGroup>
        <Input
          type="text"
          value={inputCfId}
          onChange={(e) => setInputCfId(e.target.value)}
          placeholder="e.g. 158A, 4A, 1900B"
        />
        <button type="submit">Analyze Problem</button>
      </InputGroup>
      {error && <ErrorText>{error}</ErrorText>}
    </Form>
  );
}
