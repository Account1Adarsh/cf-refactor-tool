// import React, { useState } from 'react';
// import styled from 'styled-components';
// import { refactorCode } from '../services/api';

// const Text = styled.textarea`
//   width: 100%;
//   height: 200px;
//   background: #2b2b2b;
//   color: #f5f5f5;
//   border: 1px solid #e63946;
//   border-radius: 6px;
//   padding: 0.5rem;
//   margin: 1rem 0;
// `;

// export default function CodeRefactor({ cf_id }) {
//   const [code, setCode] = useState('');
//   const [refactored, setRefactored] = useState('');
//   const [explanation, setExplanation] = useState('');
//   const [error, setError] = useState('');

//   const handleRefactor = async () => {
//     try {
//       const result = await refactorCode(code, null, cf_id);
//       setRefactored(result.refactored);
//       setExplanation(result.explanation);
//     } catch (e) {
//       setError(e.message);
//     }
//   };

//   return (
//     <div>
//       <h3 style={{color:'#e63946'}}>Paste Your C++ Code Below</h3>
//       <Text
//         placeholder="Paste code here…"
//         value={code}
//         onChange={e => setCode(e.target.value)}
//       />
//       <button onClick={handleRefactor}>Refactor & Explain</button>
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {refactored && (
//         <>
//           <h3 style={{color:'#e63946'}}>Refactored Code</h3>
//           <pre style={{ background:'#2b2b2b', color:'#f5f5f5', padding:'1rem', borderRadius:'6px' }}>
//             {refactored}
//           </pre>
//         </>
//       )}
//       {explanation && (
//         <>
//           <h3 style={{color:'#e63946'}}>Explanation</h3>
//           <p style={{ whiteSpace:'pre-wrap' }}>{explanation}</p>
//         </>
//       )}
//     </div>
//   );
// }
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { refactorCode } from '../services/api';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 4px solid ${({ theme }) => theme.border};
  border-top: 4px solid ${({ theme }) => theme.accent};
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: ${spin} 1s linear infinite;
`;

const Container = styled.div`
  background: ${({ theme }) => theme.cardBg};
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.accent};
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Text = styled.textarea`
  width: 100%;
  height: 250px;
  background: ${({ theme }) => theme.darkBg};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.95rem;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.accent};
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  &::placeholder {
    color: ${({ theme }) => theme.textMuted};
  }
`;

const CodeBlock = styled.pre`
  background: ${({ theme }) => theme.darkBg};
  color: ${({ theme }) => theme.text};
  padding: 1.5rem;
  border-radius: 8px;
  font-family: 'Fira Code', monospace;
  white-space: pre-wrap;
  border: 1px solid ${({ theme }) => theme.border};
  overflow-x: auto;
  line-height: 1.5;
  font-size: 0.95rem;
`;

const RedComment = styled.span`
  color: ${({ theme }) => theme.danger};
`;

const ErrorBox = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid ${({ theme }) => theme.danger};
  padding: 1rem;
  border-radius: 8px;
  color: ${({ theme }) => theme.danger};
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 0.75rem;
`;

const ExplanationBlock = styled.div`
  background: ${({ theme }) => theme.darkBg};
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  
  button {
    padding: 0.4rem 0.75rem;
    font-size: 0.85rem;
    border-radius: 6px;
    background: ${({ theme }) => theme.border};
    &:hover {
      background: ${({ theme }) => theme.accentHover};
    }
  }
`;

export default function CodeRefactor({ cf_id }) {
  const [code, setCode] = useState('');
  const [refactored, setRefactored] = useState('');
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRefactor = async () => {
    if (!code.trim()) {
      setError('Please paste your C++ code to refactor.');
      return;
    }
    setError('');
    setLoading(true);
    setRefactored('');
    setExplanation('');
    try {
      const result = await refactorCode(code, null, cf_id);
      setRefactored(result.refactored);
      setExplanation(result.explanation);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(refactored);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderWithCommentColor = (codeText) => {
    return codeText.split('\n').map((line, i) => {
      const parts = line.split(/(\/\/.*)/);
      return (
        <div key={i}>
          {parts.map((part, idx) =>
            part.startsWith('//') ? (
              <RedComment key={idx}>{part}</RedComment>
            ) : (
              <span key={idx}>{part}</span>
            )
          )}
        </div>
      );
    });
  };

  return (
    <Container>
      <Title>Paste Your C++ Code Below</Title>
      <Text
        placeholder="int main() {\n  // Your code here...\n}"
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      <Button onClick={handleRefactor} disabled={loading}>
        {loading ? (
          <>
            <Spinner /> Refactoring Magic...
          </>
        ) : (
          '✨ Refactor & Explain'
        )}
      </Button>

      {error && (
        <ErrorBox>
          <span>⚠️</span> {error}
        </ErrorBox>
      )}

      {refactored && (
        <div style={{ marginTop: '2rem' }}>
          <Title>
            Refactored Code
            <ActionRow>
              <button onClick={copyToClipboard}>
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </ActionRow>
          </Title>
          <CodeBlock>{renderWithCommentColor(refactored)}</CodeBlock>
        </div>
      )}

      {explanation && (
        <div style={{ marginTop: '2rem' }}>
          <Title>AI Explanation</Title>
          <ExplanationBlock>{explanation}</ExplanationBlock>
        </div>
      )}
    </Container>
  );
}
