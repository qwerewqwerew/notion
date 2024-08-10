import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// 데이터베이스 가져오기

export async function getDatabase(databaseId) {
	try {
		const response = await notion.databases.query({
			database_id: databaseId,
		});

		return response.results.map((item) => {
			const classProperty = item.properties?.class;
			const titleTextArray = classProperty?.title || [];
			const title = titleTextArray.map((textObj) => textObj.plain_text).join('') || 'No title';

			return {
				id: item.id,
				title,
			};
		});
	} catch (error) {
		return [];
	}
}
export async function getPage(pageId) {
	try {
		const response = await notion.pages.retrieve({ page_id: pageId });
		return response;
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
				block_id: pageId, // 여기가 페이지 ID로 제대로 설정되어 있는지 확인합니다.
				start_cursor: cursor,
			});

			for (const block of results) {
				blocks.push(block);
				// 자식 블록이 있는 경우, 재귀적으로 모든 자식 블록 가져오기
				if (block.has_children) {
					const childBlocks = await getBlocks(block.id);
					blocks.push(...childBlocks);
				}
			}

			cursor = next_cursor;
		} while (cursor);

		// 데이터 확인을 위한 콘솔 로그
		console.log('Fetched blocks:', blocks);

		return blocks;
	} catch (error) {
		console.error('블록패칭 에러:', error);
		return [];
	}
}