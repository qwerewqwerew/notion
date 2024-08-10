
const ChildBlock = ({ blocks }) => {
	if (!blocks || blocks.length === 0) {
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
