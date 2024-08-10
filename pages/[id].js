import { getPage, getDatabase } from '../lib/notion';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
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

		if (!page) {
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
			},
			revalidate: 10,
		};
	} catch (error) {
		console.error('데이터패칭오류:', error);
		return {
			notFound: true,
		};
	}
}

export default function Page({ page }) {
	const router = useRouter();
	const [blocks, setBlocks] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchBlocks = async () => {
			try {
				const response = await fetch(`/api/notion-proxy?blockId=${page.id}`);
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				const data = await response.json();
				setBlocks(data.results);
			} catch (error) {
				setError(error);
			}
		};

		fetchBlocks();
	}, [page.id]);

	if (error) return <div>Error: {error.message}</div>;
	if (!blocks || blocks.length === 0) return <div>Loading...</div>;

	const title = page.title || '';

	return (
		<div className='container mt-5'>
			<button onClick={() => router.back()} className='btn btn-secondary mb-3'>
				이전으로 가기
			</button>
			<h1 className='display-4 mb-4'>{title}</h1>
			<div className='container' id={`id-${page.id}`}>
				{blocks.map((block) => (
					<Block key={block.id} block={block} />
				))}
			</div>
		</div>
	);
}
