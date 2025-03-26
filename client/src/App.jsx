import React, { useState } from 'react';
import TabSwitcher from './components/TabSwitcher';
import BlockWorkspace from './components/BlockWorkspace';
import TestCasePanel from './components/TestCasePanel';

const App = () => {
  const [activeTab, setActiveTab] = useState('prompt');
  const [testCaseOpen, setTestCaseOpen] = useState(true);

  return (
    <div className="app">
      <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main">
        {activeTab === 'prompt' ? (
          <div className="prompt-view">
            <h2>Problem Prompt</h2>
            <p>Write a program that prints numbers from 1 to 10.</p>
          </div>
        ) : (
          <BlockWorkspace />
        )}
        <TestCasePanel open={testCaseOpen} setOpen={setTestCaseOpen} />
      </div>
    </div>
  );
};

export default App;
