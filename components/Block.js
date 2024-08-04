// components/Block.js

import React from 'react';
import Link from 'next/link';
import styles from '../styles/Page.module.css';

const Block = ({ block }) => {
	const { type, id } = block;
	const value = block[type];

	const renderRichText = (richTextArray) => {
		return richTextArray.map((text) => text.plain_text).join('');
	};

	switch (type) {
		case 'paragraph':
			return (
				<div key={id} className={styles.paragraph}>
					{renderRichText(value.rich_text)}
				</div>
			);
		case 'heading_1':
			return (
				<div key={id} className={styles.heading1}>
					{renderRichText(value.rich_text)}
				</div>
			);
		case 'heading_2':
			return (
				<div key={id} className={styles.heading2}>
					{renderRichText(value.rich_text)}
				</div>
			);
		case 'heading_3':
			return (
				<div key={id} className={styles.heading3}>
					{renderRichText(value.rich_text)}
				</div>
			);
		case 'bulleted_list_item':
			return (
				<div key={id} className={styles.listItem}>
					{renderRichText(value.rich_text)}
				</div>
			);
		case 'numbered_list_item':
			return (
				<div key={id} className={styles.listItem}>
					{renderRichText(value.rich_text)}
				</div>
			);
		case 'to_do':
			return (
				<div key={id} className={styles.paragraph}>
					<input type='checkbox' checked={value?.checked} readOnly className={styles.checkbox} />
					<span>{renderRichText(value.rich_text)}</span>
				</div>
			);
		case 'toggle':
			return (
				<div key={id} className={styles.toggle}>
					<details>
						<summary>{renderRichText(value.rich_text)}</summary>
						{block.children?.map((child) => (
							<Block key={child.id} block={child} />
						))}
					</details>
				</div>
			);
		case 'quote':
			return (
				<div key={id} className={styles.blockquote}>
					{renderRichText(value.rich_text)}
				</div>
			);
		case 'code':
			return (
				<div key={id} className={styles.code}>
					<pre>
						<code>{renderRichText(value.rich_text)}</code>
					</pre>
				</div>
			);
		case 'image':
			const src = value?.type === 'external' ? value.external.url : value.file.url;
			const caption = value?.caption?.length ? renderRichText(value.caption) : '';
			return (
				<div key={id} className={styles.image}>
					<figure>
						<img src={src} alt={caption} loading='lazy' />
						{caption && <figcaption>{caption}</figcaption>}
					</figure>
				</div>
			);
		case 'divider':
			return (
				<div key={id} className={styles.divider}>
					<hr />
				</div>
			);
		case 'file':
			const fileSrc = value?.type === 'external' ? value.external.url : value.file.url;
			return (
				<div key={id} className={styles.bookmark}>
					<a href={fileSrc}>{fileSrc}</a>
				</div>
			);
		case 'bookmark':
			return (
				<div key={id} className={styles.bookmark}>
					<a href={value?.url}>{value?.url}</a>
				</div>
			);
		case 'embed':
			return (
				<div key={id} className={styles.embed}>
					<iframe src={value?.url} title='Embed' width='100%' height='400px' />
				</div>
			);
		case 'child_page':
			const childPageTitle = block.child_page?.title || 'Untitled';
			return (
				<div key={id} className={styles.childPage}>
					<h2>
						<Link href={`/${block.id}`}>{childPageTitle}</Link>
					</h2>
					{block.child_page.blocks?.length > 0 && (
						<div className={styles.childBlocks}>
							{block.child_page.blocks.map((childBlock) => (
								<Block key={childBlock.id} block={childBlock} />
							))}
						</div>
					)}
				</div>
			);
		default:
			return <div key={id}>Unsupported block type: {type}</div>;
	}
};

export default Block;
