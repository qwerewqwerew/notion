// pages/[id].js

import { getDatabase, getPage, getBlocks } from '../lib/notion';
import styles from '../styles/Page.module.css';
import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Block = dynamic(() => import('../components/Block'), {
	ssr: false,
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
						<img src={src} alt={caption} loading='lazy' />
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
		case 'embed':
			return (
				<div key={id} className={styles.embed}>
					<iframe src={value?.url} title='Embed' width='100%' height='400px' />
				</div>
			);
		case 'child_page':
			const childPageTitle = block.child_page?.title || '';
			if (childPageTitle) {
				// 제목이 있을 때만 렌더링
				return (
					<div key={id} className={styles.childPage}>
						<h2>
							<Link href={`/${block.id}`}>{childPageTitle}</Link>
						</h2>
						{block.child_page.blocks && <div className={styles.childBlocks}>{block.child_page.blocks.map(renderBlock)}</div>}
					</div>
				);
			}
			return null; // 제목이 없으면 렌더링하지 않음
		default:
			return <div key={id}>Unsupported block type: {type}</div>;
	}
};

export default function Page({ page, blocks }) {
	const router = useRouter();

	if (!page || !blocks) {
		return <div>Loading...</div>;
	}

	const title = page.title || ''; // 제목이 없을 때 빈 문자열

	return (
		<div className={styles.body}>
			<button onClick={() => router.back()} className={styles.backButton}>
				이전으로 가기
			</button>
			<div className={styles.container}>
				{title && <div className={styles.title}>{title}</div>} {/* 제목이 있을 때만 표시 */}
				<div>{blocks.map((block) => renderBlock(block))}</div>
			</div>
		</div>
	);
}
