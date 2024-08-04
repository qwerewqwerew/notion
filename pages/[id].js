// pages/[id].js

import { getDatabase, getPage, getBlocks } from '../lib/notion'; // 여기에서 getPage 함수가 import되고 있는지 확인
import styles from '../styles/Page.module.css';
import { useRouter } from 'next/router';
import Block from '../components/Block';

export async function getStaticPaths() {
	const database = await getDatabase();
	const paths = database.map((page) => ({ params: { id: page.id } }));
	return {
		paths,
		fallback: true,
	};
}

export async function getStaticProps(context) {
	const { id } = context.params;

	try {
		const page = await getPage(id);
		const { blocks } = await getBlocks(id); // 블록 데이터와 커서를 가져옵니다.
		// 콘솔 로그로 확인
		console.log('Page:', page);
		console.log('Blocks:', blocks);

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
				blocks: blocks || [], // blocks가 없을 경우 빈 배열을 설정합니다.
			},
		};
	} catch (error) {
		console.error('Error fetching page data:', error);
		return {
			props: {
				page: null,
				blocks: [],
			},
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
