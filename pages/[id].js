// pages/[id].js

import { getDatabase, getPage, getBlocks } from '../lib/notion';
import styles from '../styles/Page.module.css';
import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Block 컴포넌트를 동적으로 로드합니다.
const Block = dynamic(() => import('../components/Block'), {
	ssr: false, // 서버 사이드 렌더링을 비활성화하여 클라이언트에서만 로드
});

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
		const blocks = await getBlocks(id);

		// 페이지 및 블록 데이터 로그
		console.log(`Page: ${id}`, JSON.stringify(page, null, 2));
		console.log(`Blocks: ${id}`, JSON.stringify(blocks, null, 2));

		if (!page || !blocks) {
			return {
				notFound: true, // 페이지가 없는 경우 404 반환
			};
		}

		// 안전하게 제목 가져오기
		const pageTitle = page.properties?.이름?.title?.[0]?.plain_text || 'Untitled';

		return {
			props: {
				page: {
					id: page.id,
					title: pageTitle,
				},
				blocks,
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

const renderBlock = (block) => {
	const { type, id } = block;
	const value = block[type];

	// 블록 렌더링 로그
	console.log(`Rendering block: ${type}`, JSON.stringify(block, null, 2));

	switch (type) {
		case 'paragraph':
			return (
				<div key={id} className={styles.paragraph}>
					{value?.rich_text?.map((text) => text.plain_text).join('') || ''}
				</div>
			);
		case 'heading_1':
			return (
				<div key={id} className={styles.heading1}>
					{value?.rich_text?.map((text) => text.plain_text).join('') || ''}
				</div>
			);
		case 'heading_2':
			return (
				<div key={id} className={styles.heading2}>
					{value?.rich_text?.map((text) => text.plain_text).join('') || ''}
				</div>
			);
		case 'heading_3':
			return (
				<div key={id} className={styles.heading3}>
					{value?.rich_text?.map((text) => text.plain_text).join('') || ''}
				</div>
			);
		case 'bulleted_list_item':
			return (
				<div key={id} className={styles.listItem}>
					{value?.rich_text?.map((text) => text.plain_text).join('') || ''}
				</div>
			);
		case 'numbered_list_item':
			return (
				<div key={id} className={styles.listItem}>
					{value?.rich_text?.map((text) => text.plain_text).join('') || ''}
				</div>
			);
		case 'to_do':
			return (
				<div key={id} className={styles.paragraph}>
					<input type='checkbox' checked={value?.checked} readOnly className={styles.checkbox} />
					<span>{value?.rich_text?.map((text) => text.plain_text).join('') || ''}</span>
				</div>
			);
		case 'toggle':
			return (
				<div key={id} className={styles.toggle}>
					<details>
						<summary>{value?.rich_text?.map((text) => text.plain_text).join('') || ''}</summary>
						{value?.children?.map(renderBlock)}
					</details>
				</div>
			);
		case 'quote':
			return (
				<div key={id} className={styles.blockquote}>
					{value?.rich_text?.map((text) => text.plain_text).join('') || ''}
				</div>
			);
		case 'code':
			return (
				<div key={id} className={styles.code}>
					<pre>
						<code>{value?.rich_text?.map((text) => text.plain_text).join('') || ''}</code>
					</pre>
				</div>
			);
		case 'image':
			const src = value?.type === 'external' ? value.external.url : value.file.url;
			const caption = value?.caption?.length ? value.caption[0].plain_text : '';
			return (
				<div key={id} className={styles.image}>
					<figure>
						<img src={src} alt={caption} loading='lazy' /> {/* 이미지 지연 로딩 */}
						{caption && <figcaption>{caption}</figcaption>}
					</figure>
				</div>
			);
		case 'divider':
			return (
				<div key={id} className={styles.divider}>
					<hr />
				</div>
			);
		case 'file':
			const fileSrc = value?.type === 'external' ? value.external.url : value.file.url;
			return (
				<div key={id} className={styles.bookmark}>
					<a href={fileSrc}>{fileSrc}</a>
				</div>
			);
		case 'bookmark':
			return (
				<div key={id} className={styles.bookmark}>
					<a href={value?.url}>{value?.url}</a>
				</div>
			);
		case 'child_page':
			// 자식 페이지의 제목 안전하게 가져오기
			const childPageTitle = block.child_page?.title || 'Untitled';
			return (
				<div key={id} className={styles.childPage}>
					<h2>
						<Link href={`/${block.id}`}>{childPageTitle}</Link>
					</h2>
					{/* 자식 페이지의 블록을 렌더링 */}
					{block.child_page.blocks && <div className={styles.childBlocks}>{block.child_page.blocks.map(renderBlock)}</div>}
				</div>
			);
		default:
			return <div key={id}>Unsupported block type: {type}</div>;
	}
};

export default function Page({ page, blocks }) {
	const router = useRouter();

	if (!page || !blocks) {
		return <div>Loading...</div>;
	}

	const title = page.title || 'No title';

	return (
		<div className={styles.body}>
			<button onClick={() => router.back()} className={styles.backButton}>
				이전으로 가기
			</button>
			<div className={styles.container}>
				<div className={styles.title}>{title}</div>
				<div>{blocks.map((block) => renderBlock(block))}</div>
			</div>
		</div>
	);
}
