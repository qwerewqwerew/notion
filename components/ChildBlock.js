import React, { useEffect, useState } from 'react';
import { getBlocks } from '../lib/notion';
import Block from './Block';

const ChildBlock = ({ blockId }) => {
	const [childBlocks, setChildBlocks] = useState([]);

	useEffect(() => {
		const fetchChildBlocks = async () => {
			if (blockId) {
				const blocks = await getBlocks(blockId);
				setChildBlocks(blocks);
			}
		};

		fetchChildBlocks();
	}, [blockId]);

	if (!childBlocks || childBlocks.length === 0) {
		return null;
	}

	return (
		<div className='child-block'>
			{childBlocks.map((block) => (
				<Block key={block.id} block={block} />
			))}
		</div>
	);
};

export default ChildBlock;
