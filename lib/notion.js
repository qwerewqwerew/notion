import { Client } from '@notionhq/client';

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
			// title은 배열 형태로 되어 있으며, 각 요소의 plain_text를 연결하여 가져옵니다.
			const titleTextArray = classProperty?.title || [];
			const title = titleTextArray.map((textObj) => textObj.plain_text).join('') || 'No title';

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
export async function getPage(pageId) {
	try {
		const response = await notion.pages.retrieve({ page_id: pageId });
		console.log('Page Data:', response); // 페이지 데이터 확인용 로그
		return response;
	} catch (error) {
		console.error('Error fetching page:', error);
		return null;
	}
}

// 하위 블록 가져오기
export async function getBlocks(blockId) {
	const blocks = [];
	let cursor;

	try {
		do {
			const { results, next_cursor } = await notion.blocks.children.list({
				block_id: blockId,
				start_cursor: cursor,
			});

			results.forEach((block) => {
				if (block.type === 'toggle') {
					const toggleChildren = getBlocks(block.id); // 재귀적으로 하위 블록 가져오기
					block.toggle.children = toggleChildren;
				}
			});

			blocks.push(...results);
			cursor = next_cursor;
		} while (cursor);

		return blocks;
	} catch (error) {
		console.error('Error fetching blocks:', error);
		return [];
	}
}
