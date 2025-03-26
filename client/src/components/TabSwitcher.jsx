import React from 'react';

const TabSwitcher = ({ activeTab, setActiveTab }) => {
  return (
    <div className="tabs">
      <button onClick={() => setActiveTab('prompt')} className={activeTab === 'prompt' ? 'active' : ''}>Prompt</button>
      <button onClick={() => setActiveTab('blocks')} className={activeTab === 'blocks' ? 'active' : ''}>Blocks</button>
    </div>
  );
};

export default TabSwitcher;
