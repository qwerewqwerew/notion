// pages/index.js

import { getDatabase } from '../lib/notion';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS 가져오기

export async function getStaticProps() {
	const databaseId = process.env.NOTION_DATABASE_ID;

	if (!databaseId) {
		throw new Error('Notion database ID is not set. Please check your environment variables.');
	}

	const database = await getDatabase(databaseId);
	return {
		props: {
			database,
		},
		revalidate: 10, // ISR 설정
	};
}

export default function Home({ database }) {
	return (
		<div className='container mt-5'>
			<h1 className='display-4 mb-4'>Notion Database</h1>
			<div className='list-group'>
				{database.map((item) => (
					<div key={item.id} className='list-group-item'>
						<h2 className='h5'>
							<Link href={`/${item.id}`} className='text-decoration-none text-primary'>
								{item.title}
							</Link>
						</h2>
					</div>
				))}
			</div>
		</div>
	);
}
