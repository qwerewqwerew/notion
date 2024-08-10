import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import ChildBlock from './ChildBlock';
import ListGroup from './ListGroup';
import RenderRichText from './RenderRichText';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getBlocks } from '../lib/notion';
import Table from './Table';

const Block = ({ block }) => {
	const { type, id, has_children } = block;
	const [childBlocks, setChildBlocks] = useState([]);

	useEffect(() => {
		const fetchChildBlocks = async () => {
			if (has_children) {
				try {
					const response = await fetch(`/api/notion-proxy?blockId=${id}`); // 페이지 ID를 사용하여 호출
					if (!response.ok) {
						throw new Error('Network response was not ok');
					}
					const data = await response.json();
					console.log('Fetched child blocks:', data.results); // 콘솔 로그로 데이터 확인
					setChildBlocks(data.results);
				} catch (error) {
					console.error('Error fetching child blocks:', error);
				}
			}
		};

		fetchChildBlocks();
	}, [id, has_children]);

	const renderCodeBlock = (code, language = 'javascript') => {
		const copyToClipboard = () => {
			navigator.clipboard.writeText(code).then(
				() => {
					alert('코드가 클립보드에 복사되었습니다.');
				},
				(err) => {
					console.error('코드를 복사하는 중에 오류가 발생했습니다.', err);
				}
			);
		};

		return (
			<div className={`snippets position-relative`}>
				<button onClick={copyToClipboard} className='btn btn-dark btn-sm position-absolute copy'>
					복사
				</button>
				<SyntaxHighlighter language={language} style={oneDark} customStyle={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word', padding: '20px' }}>
					{code}
				</SyntaxHighlighter>
			</div>
		);
	};

	const renderBlock = () => {
		switch (type) {
			case 'paragraph':
				return (
					<p key={id} className='mb-3'>
						<RenderRichText richTextArray={block.paragraph.rich_text} />
					</p>
				);

			case 'heading_1':
			case 'heading_2':
			case 'heading_3': {
				const num = `${type.split('_')[1]}`;
				const HeadingTag = `h${num}`;
				return (
					<HeadingTag key={id} className={`h${num} headline`}>
						<RenderRichText richTextArray={block[type].rich_text} />
					</HeadingTag>
				);
			}

			case 'quote':
				return (
					<blockquote key={id} className='blockquote mb-3'>
						<RenderRichText richTextArray={block.quote.rich_text} />
					</blockquote>
				);

			case 'numbered_list_item':
			case 'bulleted_list_item':
				return <ListGroup key={id} items={[block]} />;

			case 'toggle': {
				const [isOpen, setIsOpen] = useState(false);
				return (
					<div key={id} className='mb-3'>
						<div className='btn btn-link border-bottom rounded-2 text-decoration-none border-primary-subtle p-3' onClick={() => setIsOpen(!isOpen)}>
							<RenderRichText richTextArray={block.toggle.rich_text} />
						</div>
						{isOpen && has_children && <ChildBlock blockId={id} />}
					</div>
				);
			}

			case 'image': {
				const imageUrl = block.image.file?.url || block.image.external?.url;
				return <img key={id} src={imageUrl} alt='Image' className='img-fluid shadow border border-muted ' />;
			}

			case 'code': {
				const code = block.code.rich_text.map((text) => text.plain_text).join('\n');
				const language = block.code.language || 'plaintext';
				return (
					<div key={id} className='mb-3 mx-3 code col-12 code'>
						{renderCodeBlock(code, language)}
					</div>
				);
			}

			case 'divider':
				return <hr key={id} className='my-4' />;

			case 'callout':
				return (
					<div key={id} className='alert alert-light callout'>
						<RenderRichText richTextArray={block.callout.rich_text} />
					</div>
				);

			case 'embed':
				return <iframe key={id} src={block.embed.url} className='embed-responsive-item' allowFullScreen></iframe>;

			case 'video': {
				const videoUrl = block.video.file?.url || block.video.external?.url;
				return (
					<video key={id} controls className='w-100 mb-3'>
						<source src={videoUrl} type='video/mp4' />
					</video>
				);
			}

			case 'file': {
				const fileUrl = block.file.file?.url || block.file.external?.url;
				return (
					<Link key={id} href={fileUrl}>
						<span className='link-primary'>파일 다운로드</span>
					</Link>
				);
			}

			case 'bookmark':
				return (
					<Link key={id} href={block.bookmark.url}>
						<span className='link-primary'>{block.bookmark.url}</span>
					</Link>
				);

			case 'column_list': {
				const columns = block.columns || [];
				if (!columns.length) {
					return null;
				}
				return (
					<div key={id} className='d-flex flex-wrap'>
						{columns.map((column, colIndex) => (
							<div key={`col-${colIndex}`} className='flex-grow-1'>
								{column.children.map((childBlock) => (
									<ChildBlock key={childBlock.id} blockId={childBlock.id} />
								))}
							</div>
						))}
					</div>
				);
			}

			case 'table':
				return <Table block={block} childBlocks={childBlocks} />;

			case 'child_page': {
				const childPageTitle = block.child_page?.title || '제목 없음';
				return (
					<div key={id} className='card mb-3'>
						<div className='card-body'>
							<Link href={`/${block.id}`}>
								<span className='stretched-link'>{childPageTitle}</span>
							</Link>
							<ChildBlock blockId={block.id} />
						</div>
					</div>
				);
			}

			default:
				return <div key={id}>지원하지 않는 블록 타입: {type}</div>;
		}
	};

	return <>{renderBlock()}</>;
};

export default Block;
