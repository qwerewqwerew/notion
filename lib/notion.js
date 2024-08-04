// lib/notion.js

import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function getDatabase() {
	const response = await notion.databases.query({
		database_id: process.env.NOTION_DATABASE_ID,
	});
	return response.results;
}

export async function getPage(pageId) {
	const response = await notion.pages.retrieve({ page_id: pageId });

	const titleProperty = response.properties?.이름;
	const titleTextArray = titleProperty?.title;
	const titleText = titleTextArray?.[0]?.plain_text;

	return {
		...response,
		title: titleText || '', // 제목이 없을 때 빈 문자열 반환
	};
}

export async function getBlocks(blockId, startCursor = undefined) {
	const { results, next_cursor } = await notion.blocks.children.list({
		block_id: blockId,
		start_cursor: startCursor,
		page_size: 50, // 한 번에 50개의 블록만 로드
	});

	const blocks = await Promise.all(
		results.map(async (block) => {
			if (block.type === 'child_page') {
				const childPage = await getPage(block.id);
				block.child_page.title = childPage.title;
				block.child_page.blocks = await getBlocks(block.id);
			}
			return block;
		})
	);

	if (next_cursor) {
		const moreBlocks = await getBlocks(blockId, next_cursor);
		return blocks.concat(moreBlocks);
	}

	return blocks;
}
