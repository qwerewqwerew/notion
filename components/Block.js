// components/Block.js

import { useState } from 'react';
import Link from 'next/link';
import pageStyles from '../styles/Page.module.css'; // Page styles
import blockStyles from '../styles/Block.module.css'; // Block styles

const Block = ({ block }) => {
	const { type, id } = block;

	switch (type) {
		case 'paragraph':
			return (
				<div key={id} className={blockStyles.paragraph}>
					{block.paragraph.rich_text.map((text) => text.plain_text).join('')}
				</div>
			);

		case 'heading_1':
		case 'heading_2':
		case 'heading_3':
			const HeadingTag = type.replace('_', '');
			return (
				<HeadingTag key={id} className={blockStyles.heading}>
					{block[type].rich_text.map((text) => text.plain_text).join('')}
				</HeadingTag>
			);

		case 'quote':
			return (
				<blockquote key={id} className={blockStyles.quote}>
					{block.quote.rich_text.map((text) => text.plain_text).join('')}
				</blockquote>
			);

		case 'numbered_list_item':
		case 'bulleted_list_item':
			return (
				<li key={id} className={blockStyles.listItem}>
					{block[type].rich_text.map((text) => text.plain_text).join('')}
				</li>
			);

		case 'toggle':
			const [isOpen, setIsOpen] = useState(false);
			return (
				<div key={id} className={blockStyles.toggle}>
					<div className={blockStyles.toggleTitle} onClick={() => setIsOpen(!isOpen)}>
						{block.toggle.rich_text.map((text) => text.plain_text).join('')}
					</div>
					{isOpen && (
						<div className={blockStyles.toggleContent}>
							{block.toggle.children.map((childBlock) => (
								<Block key={childBlock.id} block={childBlock} />
							))}
						</div>
					)}
				</div>
			);

		case 'child_page':
			const childPageTitle = block.child_page?.title || 'Untitled';
			return (
				<div key={id} className={blockStyles.childPage}>
					<h2>
						<Link href={`/${block.id}`}>{childPageTitle}</Link>
					</h2>
					{block.child_page.blocks?.length > 0 && (
						<div className={blockStyles.childBlocks}>
							{block.child_page.blocks.map((childBlock) => (
								<Block key={childBlock.id} block={childBlock} />
							))}
						</div>
					)}
				</div>
			);

		// 추가 블록 타입 처리

		default:
			return <div key={id}>Unsupported block type: {type}</div>;
	}
};

export default Block;
