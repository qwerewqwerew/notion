import { Client } from '@notionhq/client';

// Notion 클라이언트 설정
const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req, res) {
	const { blockId } = req.query; // 여기가 페이지 ID를 받는지 확인합니다.

	if (!blockId) {
		res.status(400).json({ error: 'Block ID (Page ID) is required' });
		return;
	}

	try {
		const response = await notion.blocks.children.list({
			block_id: blockId, // 페이지 ID를 사용하여 API 호출
			page_size: 100, // 필요한 경우 페이징 처리
		});

		res.status(200).json(response);
	} catch (error) {
		console.error('Error fetching blocks:', error);
		res.status(500).json({ error: 'Failed to fetch blocks' });
	}
}
