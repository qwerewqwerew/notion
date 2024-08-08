import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import ListGroup from './ListGroup';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const ChildBlock = ({ blocks }) => {
	return (
		<>
			{blocks.map((block) => {
				const { type, id } = block;
				switch (type) {
					case 'paragraph':
						return (
							<p key={id} className='mb-3'>
								{block.paragraph.rich_text.map((text) => text.plain_text).join('')}
							</p>
						);

					case 'image': {
						const imageUrl = block.image.file?.url || block.image.external?.url;
						return <img key={id} src={imageUrl} alt='Notion image' className='img-fluid mb-3' />;
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

					case 'numbered_list_item':
					case 'bulleted_list_item':
						return <ListGroup key={id} items={[block]} />;

					// 다른 블록 타입도 여기에 추가
					default:
						return <div key={id}>지원하지 않는 블록 타입: {type}</div>;
				}
			})}
		</>
	);
};

export default ChildBlock;
