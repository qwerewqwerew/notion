// lib/notion.js

import { Client } from '@notionhq/client';

// Initialize Notion API client
const notion = new Client({ auth: process.env.NOTION_TOKEN });


// 데이터베이스 가져오기
export async function getDatabase(databaseId) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    // 각 항목의 properties를 콘솔에 출력하여 확인
    response.results.forEach((item) => {
      console.log('Item properties:', item.properties);
    });

    return response.results.map((item) => {
      // 'class' 속성에서 제목을 가져옴
      const classProperty = item.properties?.class;
      const title = classProperty?.title?.[0]?.plain_text || 'No title';
      return {
        id: item.id,
        title,
      };
    });
  } catch (error) {
    console.error('Error fetching database:', error);
    return [];
  }
}

// Export other functions like getPage and getBlocks if not already exported
export async function getPage(pageId) {
	try {
		const response = await notion.pages.retrieve({ page_id: pageId });
		const titleProperty = response.properties?.이름;
		const titleTextArray = titleProperty?.title;
		const titleText = titleTextArray?.[0]?.plain_text;
		return {
			...response,
			title: titleText || '',
		};
	} catch (error) {
		return null;
	}
}

export async function getBlocks(pageId) {
	const blocks = [];
	let cursor;

	try {
		do {
			const { results, next_cursor } = await notion.blocks.children.list({
				block_id: pageId,
				start_cursor: cursor,
			});

			for (const block of results) {
				if (block.type === 'toggle') {
					const toggleChildren = await getBlocks(block.id);
					block.toggle.children = toggleChildren;
				}
			}

			blocks.push(...results);
			cursor = next_cursor;
		} while (cursor);

		return blocks;
	} catch (error) {
		return [];
	}
}
