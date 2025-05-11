import React, { useState } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import Header from './components/Header';
import ProblemInput from './components/ProblemInput';
import ProblemMeta from './components/ProblemMeta';
import CodeRefactor from './components/CodeRefactor';

const theme = {
  darkBg: '#1e1e1e',
  text: '#f5f5f5',
  accent: '#e63946'
};

const GlobalStyle = createGlobalStyle`
  body { background: ${p => p.theme.darkBg}; color: ${p => p.theme.text}; margin:0; font-family:sans-serif; }
  button { background:${p=>p.theme.accent}; color:white; border:none; padding:.5rem 1rem; border-radius:4px; cursor:pointer; }
`;

const AppContainer = styled.div`
  max-width:800px;
  margin:auto;
  padding:1rem;
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
          <>
            <ProblemMeta cfId={cfId}/>
            <CodeRefactor cf_id={cfId}/>
          </>
        )}
      </AppContainer>
    </ThemeProvider>
  );
}
