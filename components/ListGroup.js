import React from 'react';
import ChildBlock from './ChildBlock';

const ListGroup = ({ items }) => {
	if (!items || items.length === 0) return null;

	const listType = items[0].type === 'numbered_list_item' ? 'ol' : 'ul';

	return React.createElement(
		listType,
		{ className: `${listType}-list` },
		items.map((item) => (
			<li key={item.id}>
				{item[item.type].rich_text.map((text) => text.plain_text).join('')}
				{/* 하위 블록 렌더링 */}
				{item.children && <ChildBlock blocks={item.children} />}
			</li>
		))
	);
};

export default ListGroup;
