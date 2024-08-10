import { getDatabase } from '../lib/notion';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export async function getStaticProps() {
	const databaseId = process.env.NOTION_DATABASE_ID;

	if (!databaseId) {
		throw new Error('데이터베이스 로드 오류');
	}

	const database = await getDatabase(databaseId);
	//console.log('Database:', database);

	return {
		props: {
			database,
		},
		revalidate: 10,
	};
}

export default function Home({ database }) {
	return (
		<div className='container m-5'>
			<Link href='https://coalacoding.com'>
				<h1 className='display-4 mb-4'>CoalaCoding</h1>
			</Link>
			<Link href='https://www.youtube.com/@coalacoding' target='_blank'>
				🐨 코알라코딩 유튜브🐨
			</Link>
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
