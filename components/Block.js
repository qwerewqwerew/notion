// components/Block.js
import { useState } from 'react';

const Block = ({ block }) => {
	const [expanded, setExpanded] = useState(false);
	const [additionalData, setAdditionalData] = useState(null);

	const loadMoreData = async () => {
		if (!additionalData) {
			// 필요한 추가 데이터 가져오기
			const data = await fetchAdditionalData(block.id);
			setAdditionalData(data);
		}
		setExpanded(!expanded);
	};

	return (
		<div>
			<div onClick={loadMoreData} style={{ cursor: 'pointer' }}>
				{block.content}
			</div>
			{expanded && additionalData && (
				<div>
					{/* 추가 데이터를 표시 */}
					{additionalData.map((data) => (
						<p key={data.id}>{data.text}</p>
					))}
				</div>
			)}
		</div>
	);
};

export default Block;
