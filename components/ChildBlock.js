import React from 'react';
import Block from './Block';

const ChildBlock = ({ childBlocks }) => {
	if (!childBlocks || childBlocks.length === 0) return null;

	return (
		<div className='child-block'>
			{childBlocks.map((block) => (
				<Block key={block.id} block={block} isChild={true} />
			))}
		</div>
	);
};

export default ChildBlock;
