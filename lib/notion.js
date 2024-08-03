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
	return response;
}
export async function getBlocks(blockId) {
	const blocks = [];
	let cursor;
	while (true) {
		const { results, next_cursor } = await notion.blocks.children.list({
			block_id: blockId,
			start_cursor: cursor,
		});
		blocks.push(...results);
		if (!next_cursor) break;
		cursor = next_cursor;
	}
	return blocks;
}
