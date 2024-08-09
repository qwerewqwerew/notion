// /components/Block.js
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import ChildBlock from './ChildBlock';
import ListGroup from './ListGroup';
import Link from 'next/link'; // Use Next.js Link
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Block = ({ block }) => {
	const { type, id, has_children, children } = block;

	switch (type) {
		case 'paragraph':
			return (
				<p key={id} className='mb-3'>
					{block.paragraph.rich_text.map((text) => text.plain_text).join('')}
				</p>
			);

		case 'heading_1':
		case 'heading_2':
		case 'heading_3': {
			const HeadingTag = `h${type.split('_')[1]}`;
			return (
				<HeadingTag key={id} className={`h${type.split('_')[1]} mb-3`}>
					{block[type].rich_text.map((text) => text.plain_text).join('')}
				</HeadingTag>
			);
		}

		case 'quote':
			return (
				<blockquote key={id} className='blockquote mb-3'>
					{block.quote.rich_text.map((text) => text.plain_text).join('')}
				</blockquote>
			);

		case 'numbered_list_item':
		case 'bulleted_list_item':
			// ListGroup으로 래핑된 리스트 아이템을 반환합니다.
			return <ListGroup key={id} items={[block]} />;

		case 'toggle': {
			const [isOpen, setIsOpen] = React.useState(false);
			return (
				<div key={id} className='mb-3'>
					<div className='btn btn-link border-bottom rounded-2 text-decoration-none border-primary-subtle p-3' onClick={() => setIsOpen(!isOpen)}>
						{block.toggle.rich_text.map((text) => text.plain_text).join('')}
					</div>
					{isOpen && has_children && <ChildBlock blocks={children} />}
				</div>
			);
		}

		case 'image': {
			const imageUrl = block.image.file?.url || block.image.external?.url;
			return <img key={id} src={imageUrl} alt='coalacoding' className='img-fluid shadow border border-muted ' />;
		}

		case 'code': {
			const language = block.code.language || 'plaintext';
			const codeText = block.code.rich_text.map((text) => text.plain_text).join('\n');
			return (
				<SyntaxHighlighter key={id} language={language} style={oneDark} className='mb-3'>
					{codeText}
				</SyntaxHighlighter>
			);
		}

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
				<Link key={id} href={fileUrl} className='link-primary'>
					파일 다운로드
				</Link>
			);
		}

		case 'bookmark':
			return (
				<Link key={id} href={block.bookmark.url} className='link-primary'>
					{block.bookmark.url}
				</Link>
			);

		case 'table': {
			const tableData = block.table;
			if (!tableData) {
				console.error('Table data is undefined');
				return null;
			}

			return (
				<table key={id} className='table table-bordered mb-3'>
					<tbody>
						{tableData.rows.map((row, rowIndex) => (
							<tr key={`row-${rowIndex}`}>
								{row.cells.map((cell, cellIndex) => (
									<td key={`cell-${cellIndex}`}>{cell.rich_text.map((text) => text.plain_text).join('')}</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			);
		}

		case 'column_list': {
			const columns = block.columns || [];
			if (!columns.length) {
				console.error('Columns are undefined or empty');
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

		case 'child_page': {
			const childPageTitle = block.child_page?.title || '제목 없음';
			return (
				<div key={id} className='card mb-3'>
					<div className='card-body'>
						<Link href={`/${block.id}`} className='stretched-link'>
							{childPageTitle}
						</Link>
					</div>
				</div>
			);
		}

		default:
			return <div key={id}>지원하지 않는 블록 타입: {type}</div>;
	}
};

export default Block;
