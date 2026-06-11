import React, { useState } from 'react';
import styled, { ThemeProvider, createGlobalStyle, keyframes } from 'styled-components';
import Header from './components/Header';
import ProblemInput from './components/ProblemInput';
import ProblemMeta from './components/ProblemMeta';
import CodeRefactor from './components/CodeRefactor';

const theme = {
  darkBg: '#0f172a',
  cardBg: '#1e293b',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  accent: '#3b82f6',
  accentHover: '#2563eb',
  danger: '#ef4444',
  border: '#334155'
};

const GlobalStyle = createGlobalStyle`
  body { 
    background: ${p => p.theme.darkBg}; 
    color: ${p => p.theme.text}; 
    margin: 0; 
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
  }
  button { 
    background: ${p=>p.theme.accent}; 
    color: white; 
    border: none; 
    padding: 0.75rem 1.5rem; 
    border-radius: 8px; 
    cursor: pointer; 
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.2s ease-in-out;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  button:hover {
    background: ${p=>p.theme.accentHover};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  input, textarea {
    font-family: 'Inter', sans-serif;
  }
  ::selection {
    background: rgba(59, 130, 246, 0.3);
  }
  scrollbar-color: #334155 #0f172a;
  scrollbar-width: thin;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AppContainer = styled.div`
  max-width: 900px;
  margin: auto;
  padding: 2rem 1.5rem;
  animation: ${fadeIn} 0.5s ease-out;
`;

const AnimatedSection = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

export default function App() {
  const [cfId, setCfId]       = useState('');
  const [showRefactor, setShow] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle/>
      <AppContainer>
        <Header/>
        <ProblemInput
          setCfId={setCfId}
          onSubmitted={() => setShow(true)}
        />

        {showRefactor && (
          <AnimatedSection>
            <ProblemMeta cfId={cfId}/>
            <CodeRefactor cf_id={cfId}/>
          </AnimatedSection>
        )}
      </AppContainer>
    </ThemeProvider>
  );
}
