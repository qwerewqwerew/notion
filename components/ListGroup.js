import React from 'react';
import RenderRichText from './RenderRichText';

const renderImages = (images) => {
	if (!images || images.length === 0) return null;

	return images.map((image, index) => <img key={`image-${index}`} src={image.url} alt={image.alt || 'Image'} className='shadow-lg p-3 mb-5 bg-white rounded' />);
};

const ListGroup = ({ items }) => {
	if (!items || items.length === 0) return null;

	const renderListItems = (listItems, listType) => {
		return React.createElement(
			listType,
			{ className: 'list-group list-group-flush disc' },
			listItems.map((item) => (
				<li key={item.id} className='list-group-item'>
					<RenderRichText richTextArray={item[item.type].rich_text} />
					{renderImages(item.images)}
				</li>
			))
		);
	};

	const elements = [];
	let listItems = [];
	let currentListType = null;

	items.forEach((item) => {
		if (item.type === 'numbered_list_item' || item.type === 'bulleted_list_item') {
			const listType = item.type === 'numbered_list_item' ? 'ol' : 'ul';

			if (!currentListType) {
				currentListType = listType;
			} else if (currentListType !== listType) {
				elements.push(renderListItems(listItems, currentListType));
				listItems = [];
				currentListType = listType;
			}

			listItems.push(item);
		} else {
			if (listItems.length > 0 && currentListType) {
				elements.push(renderListItems(listItems, currentListType));
				listItems = [];
				currentListType = null;
			}

			elements.push(
				<div key={item.id} className={item.type}>
					<RenderRichText richTextArray={item[item.type].rich_text} />
				</div>
			);
		}
	});

	if (listItems.length > 0 && currentListType) {
		elements.push(renderListItems(listItems, currentListType));
	}

	return <div className="group">{elements}</div>;
};

export default ListGroup;
