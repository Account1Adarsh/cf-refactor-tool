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
import styled from 'styled-components';
import { refactorCode } from '../services/api';

const Text = styled.textarea`
  width: 100%;
  height: 200px;
  background: #2b2b2b;
  color: #f5f5f5;
  border: 1px solid #e63946;
  border-radius: 6px;
  padding: 0.5rem;
  margin: 1rem 0;
`;

const CodeBlock = styled.pre`
  background: #2b2b2b;
  color: #f5f5f5;
  padding: 1rem;
  border-radius: 6px;
  font-family: monospace;
  white-space: pre-wrap;
`;

const RedComment = styled.span`
  color: #e63946;
`;

export default function CodeRefactor({ cf_id }) {
  const [code, setCode] = useState('');
  const [refactored, setRefactored] = useState('');
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState('');

  const handleRefactor = async () => {
    try {
      const result = await refactorCode(code, null, cf_id);
      setRefactored(result.refactored);
      setExplanation(result.explanation);
    } catch (e) {
      setError(e.message);
    }
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
    <div>
      <h3 style={{ color: '#e63946' }}>Paste Your C++ Code Below</h3>
      <Text
        placeholder="Paste code here…"
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      <button onClick={handleRefactor}>Refactor & Explain</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {refactored && (
        <>
          <h3 style={{ color: '#e63946' }}>Refactored Code</h3>
          <CodeBlock>{renderWithCommentColor(refactored)}</CodeBlock>
        </>
      )}

      {explanation && (
        <>
          <h3 style={{ color: '#e63946' }}>Explanation</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{explanation}</p>
        </>
      )}
    </div>
  );
}
