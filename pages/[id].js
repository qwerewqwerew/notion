// pages/[id].js

import { getPage, getBlocks, getDatabase } from '../lib/notion';
import styles from '../styles/Page.module.css';
import { useRouter } from 'next/router';
import Block from '../components/Block';

export async function getStaticPaths() {
	const databaseId = process.env.NOTION_DATABASE_ID;

	if (!databaseId) {
		throw new Error('Notion database ID is not set. Please check your environment variables.');
	}

	const database = await getDatabase(databaseId);
	const paths = database.map((page) => ({ params: { id: page.id } }));
	return {
		paths,
		fallback: 'blocking',
	};
}

export async function getStaticProps(context) {
	const { id } = context.params;

	try {
		const page = await getPage(id);
		const blocks = await getBlocks(id);

		if (!page || !blocks) {
			return {
				notFound: true,
			};
		}

		const pageTitle = page.properties?.이름?.title?.[0]?.plain_text || '';

		return {
			props: {
				page: {
					id: page.id,
					title: pageTitle,
				},
				blocks: blocks || [],
			},
			revalidate: 10, // ISR 설정
		};
	} catch (error) {
		console.error('Error fetching page data:', error);
		return {
			notFound: true,
		};
	}
}

export default function Page({ page, blocks = [] }) {
	const router = useRouter();

	if (!page || !blocks) {
		return <div>Loading...</div>;
	}

	const title = page.title || '';

	return (
		<div className={styles.body}>
			<button onClick={() => router.back()} className={styles.backButton}>
				이전으로 가기
			</button>
			<div className={styles.container}>
				{title && <div className={styles.title}>{title}</div>}
				<div>
					{blocks.map((block) => (
						<Block key={block.id} block={block} />
					))}
				</div>
			</div>
		</div>
	);
}
