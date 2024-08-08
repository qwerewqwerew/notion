// components/ChildBlock.js

import React from 'react';
import Block from './Block';

const ChildBlock = ({ blocks }) => {
  // blocks가 undefined이거나 null일 경우 빈 배열을 사용하도록 기본값 설정
  const safeBlocks = blocks || [];

  return (
    <div style={{ marginLeft: '20px' }}>
      {safeBlocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}
    </div>
  );
};

export default ChildBlock;
