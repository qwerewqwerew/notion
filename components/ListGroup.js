import React from 'react';
import RenderRichText from './RenderRichText';
import ChildBlock from './ChildBlock';

const ListGroup = ({ items, childBlocks }) => {
	if (!items || items.length === 0) return null;

	const groupListItems = (blocks) => {
		const newBlockArray = [];
		let currentList = null;

		blocks.forEach((block) => {
			if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
				if (!currentList || currentList.type !== block.type) {
					currentList = {
						type: block.type === 'bulleted_list_item' ? 'ul' : 'ol',
						children: [],
					};
					newBlockArray.push(currentList);
				}
				currentList.children.push(block);
			} else {
				newBlockArray.push(block);
				currentList = null;
			}
		});

		return newBlockArray;
	};

	const processedItems = groupListItems(items);

	const renderListItems = (listItems, listType) => {
		return React.createElement(
			listType,
			{ className: 'list-group list-group-flush disc' },
			listItems.map((item) => (
				<li key={item.id} className='list-group-item'>
					<RenderRichText richTextArray={item[item.type].rich_text} />
					{item.has_children && <ChildBlock childBlocks={childBlocks.filter((child) => child.parent.block_id === item.id)} />}
				</li>
			))
		);
	};

	const renderBlocks = (blocks) => {
		return blocks.map((item, index) => {
			if (item.type === 'ul' || item.type === 'ol') {
				return <React.Fragment key={index}>{renderListItems(item.children, item.type)}</React.Fragment>;
			} else {
				return (
					<div key={item.id} className={item.type}>
						<RenderRichText richTextArray={item[item.type].rich_text} />
						{item.has_children && <ChildBlock childBlocks={childBlocks.filter((child) => child.parent.block_id === item.id)} />}
					</div>
				);
			}
		});
	};

	return <div className='group'>{renderBlocks(processedItems)}</div>;
};

export default ListGroup;
