// pages/index.js
import { getDatabase } from '../lib/notion';
import styles from '../styles/Page.module.css';

import Link from 'next/link';

export async function getServerSideProps() {
	const database = await getDatabase();
	return {
		props: {
			database,
		},
	};
}

export default function Home({ database }) {
	return (
		<div className={styles.body}>
			<h1>Notion Database</h1>
			<ul className={styles.container}>
				{database.map((item) => {
					const title = item.properties?.이름?.title?.[0]?.plain_text || 'No title';
					const url = item.properties?.URL?.url || 'No URL';
					const tags = item.properties?.태그?.multi_select?.map((tag) => tag.name).join(', ') || 'No tags';

					return (
						<li key={item.id}>
							<h2>
								<Link href={`/${item.id}`} target='_blank'>
									{title}
								</Link>
							</h2>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
