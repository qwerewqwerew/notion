// /components/ListGroup.js
import React from 'react';
import ChildBlock from './ChildBlock';
import Link from 'next/link';

const renderRichText = (richTextArray) => {
	if (!Array.isArray(richTextArray)) return null;

	return richTextArray.map((text, index) => {
		if (text.href) {
			return (
				<Link key={`link-${index}`} href={text.href}>
					<span>{text.plain_text}</span>
				</Link>
			);
		}
		return <span key={`text-${index}`}>{text.plain_text}</span>;
	});
};

const renderImages = (images) => {
	if (!images || images.length === 0) return null;

	return images.map((image, index) => <img key={index} src={image.url} alt={image.alt || 'Image'} className='shadow-lg p-3 mb-5 bg-white rounded' />);
};

const ListGroup = ({ items }) => {
	if (!items || items.length === 0) return null;

	const elements = [];
	let listItems = [];
	let currentListType = null;
	let renderImagesFlag = false;

	const renderListItems = (listItems, listType) => {
		return React.createElement(
			listType,
			{ className: 'list-group list-group-flush disc' },
			listItems.map((item) => {
				return (
					<li key={item.id} className='list-group-item'>
						{renderRichText(item[item.type].rich_text)}
						{renderImagesFlag && renderImages(item.images)}
						{item.has_children && <ChildBlock blocks={item.children} />}
					</li>
				);
			})
		);
	};

	items.forEach((item, index) => {
		if (item.type === 'heading_2' && item.heading_2.rich_text[0].plain_text) {
			renderImagesFlag = true;
		}

		if (item.type.startsWith('heading')) {
			if (listItems.length > 0 && currentListType) {
				elements.push(renderListItems(listItems, currentListType));
				listItems = [];
				renderImagesFlag = false;
			}

			elements.push(
				<div key={item.id} className={`heading ${item.type}`}>
					{renderRichText(item[item.type].rich_text)}
				</div>
			);
		} else if (item.type === 'numbered_list_item') {
			if (!currentListType) {
				currentListType = 'ul';
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
					{renderRichText(item[item.type].rich_text)}
				</div>
			);
		}
	});

	if (listItems.length > 0 && currentListType) {
		elements.push(renderListItems(listItems, currentListType));
	}

	return <div>{elements}</div>;
};

export default ListGroup;
