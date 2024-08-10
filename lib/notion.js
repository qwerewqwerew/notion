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
		console.error('데이터베이스패칭에러:', error);
		return [];
	}
}
export async function getPage(pageId) {
	try {
		const response = await notion.pages.retrieve({ page_id: pageId });
		console.log('Page Data:', response);
		return response;
	} catch (error) {
		return null;
	}
}

export async function getBlocks(blockId) {
	const blocks = [];
	let cursor;

	try {
		do {
			const { results, next_cursor } = await notion.blocks.children.list({
				block_id: blockId,
				page_size: 50,
				start_cursor: cursor,
			});

			for (const block of results) {
				blocks.push(block);
				if (block.has_children) {
					const childBlocks = await getBlocks(block.id);
					blocks.push(...childBlocks);
				}
			}

			cursor = next_cursor;
		} while (cursor);

		console.log('Fetched blocks:', blocks);

		return blocks;
	} catch (error) {
		console.error('블록패칭 에러:', error);
		return [];
	}
}
