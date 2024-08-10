// /components/Block.js
import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import ChildBlock from './ChildBlock';
import ListGroup from './ListGroup';
import Link from 'next/link'; // Use Next.js Link
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { getBlocks } from '../lib/notion'; // Notion API에서 getBlocks 함수를 가져옵니다.

const Block = ({ block }) => {
	const { type, id, has_children, children } = block;

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

	const renderRichText = (richTextArray) => {
		return richTextArray.map((textObj, index) => <span key={`text-${index}`}>{textObj.plain_text}</span>);
	};

	switch (type) {
		case 'paragraph':
			return (
				<p key={id} className='mb-3'>
					{renderRichText(block.paragraph.rich_text)}
				</p>
			);

		case 'heading_1':
		case 'heading_2':
		case 'heading_3': {
			const num = `${type.split('_')[1]}`;
			const HeadingTag = `h${num}`;
			return (
				<HeadingTag key={id} className={`h${num} headline`}>
					{renderRichText(block[type].rich_text)}
				</HeadingTag>
			);
		}

		case 'quote':
			return (
				<blockquote key={id} className='blockquote mb-3'>
					{renderRichText(block.quote.rich_text)}
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
						{renderRichText(block.toggle.rich_text)}
					</div>
					{isOpen && has_children && <ChildBlock blocks={children} />}
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
			console.log(block.callout.rich_text);
			return (
				<div key={id} className='alert alert-light callout'>
					{renderRichText(block.callout.rich_text)}
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
								<ChildBlock key={childBlock.id} blocks={childBlock} />
							))}
						</div>
					))}
				</div>
			);
		}

		case 'table': {
			const tableData = block.table;
			const tableRows = (children || []).filter((child) => child.type === 'table_row'); // children이 undefined일 때 빈 배열로 설정

			if (!tableData || tableRows.length === 0) {
				return null;
			}

			return (
				<table key={id} className='table table-bordered mb-3'>
					<tbody>
						{tableRows.map((row, rowIndex) => (
							<tr key={`row-${rowIndex}`}>
								{row.table_row.cells.map((cell, cellIndex) => (
									<td key={`cell-${cellIndex}`}>{renderRichText(cell)}</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			);
		}

		case 'child_page': {
			const [childBlocks, setChildBlocks] = useState([]);
			const childPageTitle = block.child_page?.title || '제목 없음';

			useEffect(() => {
				async function fetchChildBlocks() {
					const blocks = await getBlocks(block.id); // 자식 페이지의 블록을 가져옴
					setChildBlocks(blocks);
				}
				fetchChildBlocks();
			}, [block.id]);

			return (
				<div key={id} className='card mb-3'>
					<div className='card-body'>
						<Link href={`/${block.id}`}>
							<span className='stretched-link'>{childPageTitle}</span>
						</Link>
						<ChildBlock blocks={childBlocks} />
					</div>
				</div>
			);
		}

		default:
			return <div key={id}>지원하지 않는 블록 타입: {type}</div>;
	}
};

export default Block;
