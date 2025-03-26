import React from 'react';

const BlockPalette = () => {
  const blocks = ['for', 'if', 'while', 'print'];

  return (
    <div className="palette">
      <h3>Blocks</h3>
      {blocks.map((block, i) => (
        <div key={i} className="block">
          {block} [ ]
        </div>
      ))}
    </div>
  );
};

export default BlockPalette;
