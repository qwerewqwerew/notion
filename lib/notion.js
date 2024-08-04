// lib/notion.js

import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function getDatabase() {
	try {
		const response = await notion.databases.query({
			database_id: process.env.NOTION_DATABASE_ID,
		});
		return response.results;
	} catch (error) {
		console.error('Error fetching database:', error);
		return [];
	}
}

export async function getPage(pageId) {
	try {
		const response = await notion.pages.retrieve({ page_id: pageId });

		// 페이지의 제목을 추출합니다.
		const titleProperty = response.properties?.이름;
		const titleTextArray = titleProperty?.title;
		const titleText = titleTextArray?.[0]?.plain_text;

		return {
			...response,
			title: titleText || '',
		};
	} catch (error) {
		console.error(`Error fetching page ${pageId}:`, error);
		return null;
	}
}

export async function getBlocks(blockId, startCursor = undefined, pageSize = 50) {
	try {
		const { results, next_cursor } = await notion.blocks.children.list({
			block_id: blockId,
			start_cursor: startCursor,
			page_size: pageSize,
		});

		// 각 블록에 대해 추가적인 데이터(하위 블록 또는 자식 페이지)를 가져옵니다.
		const blocks = await Promise.all(
			results.map(async (block) => {
				if (block.has_children) {
					// 자식 블록을 재귀적으로 가져옵니다.
					const childrenData = await getBlocks(block.id);
					block.children = childrenData.blocks; // 하위 블록을 업데이트합니다.
				}
				if (block.type === 'child_page') {
					const childPage = await getPage(block.id);
					if (childPage) {
						block.child_page.title = childPage.title;
						// 자식 페이지의 블록을 가져옵니다.
						const childBlocksData = await getBlocks(block.id);
						block.child_page.blocks = childBlocksData.blocks;
					}
				}
				return block;
			})
		);

		return { blocks, nextCursor: next_cursor };
	} catch (error) {
		console.error(`Error fetching blocks for ${blockId}:`, error);
		return { blocks: [], nextCursor: null };
	}
}
