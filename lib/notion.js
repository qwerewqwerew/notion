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

	// 페이지 응답 데이터 로그
	//console.log(`Page data for ${pageId}:`, JSON.stringify(response, null, 2));

	// properties가 정의되어 있는지 확인하고, title 경로를 안전하게 탐색
	const titleProperty = response.properties?.이름;
	const titleTextArray = titleProperty?.title;
	const titleText = titleTextArray?.[0]?.plain_text;

	return {
		...response,
		title: titleText || 'Untitled',
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
				// 자식 페이지의 제목을 API 호출로 가져오기
				const childPage = await getPage(block.id);
				block.child_page.title = childPage.title;

				// 자식 페이지의 블록을 추가로 가져오기
				block.child_page.blocks = await getBlocks(block.id);
			}
			return block;
		})
	);

	// 추가 데이터가 있는 경우 다음 데이터도 가져오기
	if (next_cursor) {
		const moreBlocks = await getBlocks(blockId, next_cursor);
		return blocks.concat(moreBlocks);
	}

	return blocks;
}
