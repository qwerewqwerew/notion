import { Client } from '@notionhq/client';

// Notion 클라이언트 인스턴스 생성
const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req, res) {
	const { blockId } = req.query; // 클라이언트에서 전달된 blockId

	if (!blockId) {
		res.status(400).json({ error: 'Block ID is required' });
		return;
	}

	try {
		const response = await notion.blocks.children.list({
			block_id: blockId,
			headers: {
				'Notion-Version': '2022-06-28',
			},
		});

		res.status(200).json(response);
	} catch (error) {
		console.error('Error fetching blocks:', error);
		res.status(500).json({ error: 'Failed to fetch blocks' });
	}
}
