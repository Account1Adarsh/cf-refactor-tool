import React, { useState } from 'react';

export default function ProblemInput({ setCfId, onSubmitted }) {
  const [inputCfId, setInputCfId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputCfId.trim()) {
      setError('Problem ID cannot be empty');
      return;
    }
    setError('');
    setCfId(inputCfId.trim());
    onSubmitted();  // Signal the parent to show ProblemMeta + CodeRefactor
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        value={inputCfId}
        onChange={(e) => setInputCfId(e.target.value)}
        placeholder="Enter Codeforces Problem ID"
        style={{
          padding: '0.5rem',
          width: '70%',
          border: '1px solid #e63946',
          borderRadius: '4px',
          marginRight: '0.5rem',
          background: '#2b2b2b',
          color: '#f5f5f5'
        }}
      />
      <button type="submit">Submit</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
