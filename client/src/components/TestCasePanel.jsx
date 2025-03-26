import React from 'react';

const TestCasePanel = ({ open, setOpen }) => {
  if (!open) {
    return (
      <div className="test-case-collapsed" onClick={() => setOpen(true)}>
        ⬅ Show Test Cases
      </div>
    );
  }

  return (
    <div className="test-case-panel">
      <button onClick={() => setOpen(false)}>➡ Collapse</button>
      <h3>Test Cases</h3>
      <p><b>Input:</b> 1 2</p>
      <p><b>Expected Output:</b> 3</p>
      <button>Run</button>
    </div>
  );
};

export default TestCasePanel;
