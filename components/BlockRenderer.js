// components/BlockRenderer.js

import React from 'react';
import Block from './Block';

const BlockRenderer = ({ blocks }) => {
  return (
    <div>
      {blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}
    </div>
  );
};

export default BlockRenderer;
