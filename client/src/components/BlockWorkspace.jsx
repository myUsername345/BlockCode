import React from 'react';
import BlockPalette from './BlockPalette';

const BlockWorkspace = () => {
  return (
    <div className="workspace">
      <BlockPalette />
      <div className="code-area">
        <h3>Drop Blocks Here</h3>
        {/* Later: Add logic to render user-assembled code */}
      </div>
    </div>
  );
};

export default BlockWorkspace;
