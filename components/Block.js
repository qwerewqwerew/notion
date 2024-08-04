// components/Block.js

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import blockStyles from '../styles/Block.module.css'; // Block styles

const Block = ({ block }) => {
	const { type, id } = block;

	switch (type) {
		case 'paragraph':
			return (
				<p key={id} className={blockStyles.paragraph}>
					{block.paragraph.rich_text.map((text) => text.plain_text).join('')}
				</p>
			);

		case 'heading_1':
		case 'heading_2':
		case 'heading_3':
			const HeadingTag = `h${type.split('_')[1]}`;
			const headingClass = blockStyles[`heading${type.split('_')[1]}`];
			return (
				<HeadingTag key={id} className={headingClass}>
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

		case 'image':
			const imageUrl = block.image.file?.url || block.image.external?.url;
			return <img key={id} src={imageUrl} alt='Notion image' className={blockStyles.image} />;

		case 'code':
			const language = block.code.language || 'javascript'; // 기본 언어 설정
			const codeText = block.code.rich_text.map((text) => text.plain_text).join('');
			return (
				<SyntaxHighlighter key={id} language={language} style={oneDark} className={blockStyles.code}>
					{codeText}
				</SyntaxHighlighter>
			);

		case 'divider':
			return <hr key={id} className={blockStyles.divider} />;

		case 'callout':
			return (
				<div key={id} className={blockStyles.callout}>
					{block.callout.rich_text.map((text) => text.plain_text).join('')}
				</div>
			);

		case 'embed':
			return <iframe key={id} src={block.embed.url} className={blockStyles.embed} frameBorder='0' allowFullScreen></iframe>;

		case 'video':
			const videoUrl = block.video.file?.url || block.video.external?.url;
			return (
				<video key={id} controls className={blockStyles.video}>
					<source src={videoUrl} type='video/mp4' />
				</video>
			);

		case 'file':
			const fileUrl = block.file.file?.url || block.file.external?.url;
			return (
				<a key={id} href={fileUrl} className={blockStyles.file} target='_blank' rel='noopener noreferrer'>
					Download File
				</a>
			);

		case 'bookmark':
			return (
				<a key={id} href={block.bookmark.url} className={blockStyles.bookmark} target='_blank' rel='noopener noreferrer'>
					{block.bookmark.url}
				</a>
			);

		case 'child_page':
			const childPageTitle = block.child_page?.title || 'Untitled';
			return (
				<div key={id} className={blockStyles.childPage}>
					<a href={`/${block.id}`} className={blockStyles.childPageLink}  rel='noopener noreferrer'>
						{childPageTitle}
					</a>
				</div>
			);

		default:
			return <div key={id}>Unsupported block type: {type}</div>;
	}
};

export default Block;
