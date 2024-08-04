// pages/index.js

import { getDatabase } from '../lib/notion';
import styles from '../styles/Page.module.css';
import Link from 'next/link';

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
		<div className={`${styles.body} ${styles.main}`}>
			<h1>Notion Database</h1>
			<ul className={styles.container}>
				{database.map((item) => (
					<li key={item.id}>
						<h2>
							<Link href={`/${item.id}`} className={styles.mainTitle}>
								{item.title}
							</Link>
						</h2>
					</li>
				))}
			</ul>
		</div>
	);
}
