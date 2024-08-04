// pages/index.js
import { getDatabase } from '../lib/notion';
import styles from '../styles/Page.module.css';
import Link from 'next/link';

export async function getStaticProps() {
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
					return (
						<li key={item.id}>
							<h2>
								<Link href={`/${item.id}`} className={styles.mainTitle}>
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
