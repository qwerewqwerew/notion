// components/Block.js

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS 가져오기

const ChildBlockBlock = ({ block }) => {
	const { type, id } = block;

	switch (type) {
		case 'paragraph':
			return (
				<p key={id} className='mb-3'>
					{block.paragraph.rich_text.map((text) => text.plain_text).join('')}
				</p>
			);

		case 'heading_1':
		case 'heading_2':
		case 'heading_3':
			const HeadingTag = `h${type.split('_')[1]}`;
			return (
				<HeadingTag key={id} className={`h${type.split('_')[1]} mb-3`}>
					{block[type].rich_text.map((text) => text.plain_text).join('')}
				</HeadingTag>
			);

		case 'quote':
			return (
				<blockquote key={id} className='blockquote mb-3'>
					{block.quote.rich_text.map((text) => text.plain_text).join('')}
				</blockquote>
			);

		case 'numbered_list_item':
		case 'bulleted_list_item':
			return (
				<div key={id} className='list-group-item'>
					{block[type].rich_text.map((text) => text.plain_text).join('')}
				</div>
			);

		case 'toggle':
			const [isOpen, setIsOpen] = useState(false);
			return (
				<div key={id} className='mb-3'>
					<div className='btn btn-link border-bottom rounded-2 text-decoration-none border-primary-subtle p-3' onClick={() => setIsOpen(!isOpen)}>
						{block.toggle.rich_text.map((text) => text.plain_text).join('')}
					</div>
					{isOpen && block.toggle.children && (
						<div className='ml-3'>
							{block.toggle.children.map((childBlock) => (
								<Block key={childBlock.id} block={childBlock} />
							))}
						</div>
					)}
				</div>
			);

		case 'image':
			const imageUrl = block.image.file?.url || block.image.external?.url;
			return <img key={id} src={imageUrl} alt='Notion image' className='img-fluid mb-3' />;

		case 'code':
			// 코드 블록의 언어 설정. 언어가 없는 경우 기본값은 'plaintext'로 설정
			const language = block.code.language || 'plaintext';
			// 코드 텍스트를 가져와서 줄바꿈 문자로 연결
			const codeText = block.code.rich_text.map((text) => text.plain_text).join('\n');
			return (
				<SyntaxHighlighter key={id} language={language} style={oneDark} className='mb-3'>
					{codeText}
				</SyntaxHighlighter>
			);

		case 'divider':
			return <hr key={id} className='my-4' />;

		case 'callout':
			return (
				<div key={id} className='alert alert-info'>
					{block.callout.rich_text.map((text) => text.plain_text).join('')}
				</div>
			);

		case 'embed':
			return <iframe key={id} src={block.embed.url} className='embed-responsive-item' frameBorder='0' allowFullScreen></iframe>;

		case 'video':
			const videoUrl = block.video.file?.url || block.video.external?.url;
			return (
				<video key={id} controls className='w-100 mb-3'>
					<source src={videoUrl} type='video/mp4' />
				</video>
			);

		case 'file':
			const fileUrl = block.file.file?.url || block.file.external?.url;
			return (
				<a key={id} href={fileUrl} className='link-primary' target='_blank' rel='noopener noreferrer'>
					Download File
				</a>
			);

		case 'bookmark':
			return (
				<a key={id} href={block.bookmark.url} className='link-primary' target='_blank' rel='noopener noreferrer'>
					{block.bookmark.url}
				</a>
			);

		case 'child_page':
			const childPageTitle = block.child_page?.title || 'Untitled';
			return (
				<div key={id} className='card mb-3'>
					<div className='card-body'>
						<a href={`/${block.id}`} className='stretched-link'>
							{childPageTitle}
						</a>
					</div>
				</div>
			);

		default:
			return <div key={id}>Unsupported block type: {type}</div>;
	}
};

export default ChildBlockBlock;
