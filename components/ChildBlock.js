
const ChildBlock = ({ blocks }) => {
	if (!blocks || blocks.length === 0) {
		console.error('블록이 비었음');
		return null; // 빈 블록일 경우 null 반환
	}

	return (
		<div className='child-blocks'>
			{blocks.map((block, index) => (
				<div key={block.id || `block-${index}`} className='block'>
					{block.content}
				</div>
			))}
		</div>
	);
};

export default ChildBlock;
