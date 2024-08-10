import { getPage, getBlocks, getDatabase } from '../lib/notion';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.min.css';

const Block = dynamic(() => import('../components/Block'), {
	ssr: false,
});

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

		//console.log('Fetched Page:', page); // 페이지 데이터 로그
		//console.log('Fetched Blocks:', blocks); // 블록 데이터 로그

		if (!page || !blocks) {
			return {
				notFound: true,
			};
		}

		const pageTitle = page.properties?.class?.title?.[0]?.plain_text || '';

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
		<div className='container mt-5'>
			<button onClick={() => router.back()} className='btn btn-secondary mb-3'>
				이전으로 가기
			</button>
			<h1 className='display-4 mb-4'>{title}</h1>
			<div className='accordion' id={`accordion-${page.id}`}>
				{blocks.map((block) => (
					<Block key={block.id} block={block} parentId={`accordion-${page.id}`} />
				))}
			</div>
		</div>
	);
}
