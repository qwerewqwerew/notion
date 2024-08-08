// components/Block.js

import React from 'react';
import ChildBlock from './ChildBlock';

const Block = ({ block }) => {
  const { type, has_children } = block;

  switch (type) {
    case 'paragraph':
      return (
        <p>{block.paragraph.rich_text.map((text) => text.plain_text).join('')}</p>
      );

    case 'heading_1':
      return (
        <h1>{block.heading_1.rich_text.map((text) => text.plain_text).join('')}</h1>
      );

    case 'heading_2':
      return (
        <h2>{block.heading_2.rich_text.map((text) => text.plain_text).join('')}</h2>
      );

    case 'heading_3':
      return (
        <h3>{block.heading_3.rich_text.map((text) => text.plain_text).join('')}</h3>
      );

    case 'bulleted_list_item':
      return (
        <ul>
          <li>{block.bulleted_list_item.rich_text.map((text) => text.plain_text).join('')}</li>
          {has_children && <ChildBlock blocks={block.children} />}
        </ul>
      );

    case 'numbered_list_item':
      return (
        <ol>
          <li>{block.numbered_list_item.rich_text.map((text) => text.plain_text).join('')}</li>
          {has_children && <ChildBlock blocks={block.children} />}
        </ol>
      );

    case 'code':
      return (
        <pre>
          <code>{block.code.rich_text.map((text) => text.plain_text).join('')}</code>
          <button onClick={() => navigator.clipboard.writeText(block.code.rich_text.map((text) => text.plain_text).join(''))}>
            코드 복사
          </button>
        </pre>
      );

    case 'image':
      return <img src={block.image.file.url} alt="Notion Image" />;

    case 'child_page':
      return (
        <div>
          <h2>Child Page: {block.child_page.title}</h2>
          {has_children && <ChildBlock blocks={block.children} />}
        </div>
      );

    default:
      return <div>지원되지 않는 블록 유형입니다.</div>;
  }
};

export default Block;
