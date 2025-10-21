import React, { useState } from 'react';
import FactCheckerInput from './components/FactCheckerInput';
import FactCheckerResult from './components/FactCheckerResult';
import './App.css';

function App() {
  const [result, setResult] = useState(null);
  return (
    <div className="container">
      <FactCheckerInput onResult={setResult} />
      <FactCheckerResult result={result} />
    </div>
  );
}

export default App;
