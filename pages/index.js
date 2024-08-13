import { getDatabase } from '../lib/notion';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export async function getStaticProps() {
	const databaseId = process.env.NOTION_DATABASE_ID;

	if (!databaseId) {
		throw new Error('데이터베이스 로드 오류');
	}

	const database = await getDatabase(databaseId);
	return {
		props: {
			database,
		},
		revalidate: 10,
	};
}

export default function Home({ database }) {
	return (
		<div className='container my-5'>
			<Link href='https://coalacoding.com'>
				<h1 className='display-4 mb-4 brand'>CoalaCoding.com</h1>
			</Link>
			<Link href='https://www.youtube.com/@coalacoding' target='_blank'>

			</Link>
			<ul className='list-group'>
				{database.map((item) => (
					<li key={item.id} className='list-group-item'>
						<h2 className='h5'>
							<Link href={`/${item.id}`} className='text-decoration-none text-primary'>
								{item.title}
							</Link>
						</h2>
					</li>
				))}
			</ul>
		</div>
	);
}
