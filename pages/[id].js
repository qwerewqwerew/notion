// pages/[id].js
import { getDatabase, getPage, getBlocks } from '../lib/notion';
import styles from '../styles/Page.module.css';

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
	const page = await getPage(id);
	const blocks = await getBlocks(id);
	return {
		props: {
			page,
			blocks,
		},
	};
}

const renderBlock = (block) => {
	const { type, id } = block;
	const value = block[type];

	switch (type) {
		case 'paragraph':
			return (
				<div key={id} className={styles.paragraph}>
					{value.rich_text.map((text) => text.plain_text).join('')}
				</div>
			);
		case 'heading_1':
			return (
				<div key={id} className={styles.heading1}>
					{value.rich_text.map((text) => text.plain_text).join('')}
				</div>
			);
		case 'heading_2':
			return (
				<div key={id} className={styles.heading2}>
					{value.rich_text.map((text) => text.plain_text).join('')}
				</div>
			);
		case 'heading_3':
			return (
				<div key={id} className={styles.heading3}>
					{value.rich_text.map((text) => text.plain_text).join('')}
				</div>
			);
		case 'bulleted_list_item':
			return (
				<div key={id} className={styles.listItem}>
					{value.rich_text.map((text) => text.plain_text).join('')}
				</div>
			);
		case 'numbered_list_item':
			return (
				<div key={id} className={styles.listItem}>
					{value.rich_text.map((text) => text.plain_text).join('')}
				</div>
			);
		case 'to_do':
			return (
				<div key={id} className={styles.paragraph}>
					<input type='checkbox' checked={value.checked} readOnly className={styles.checkbox} />
					<span>{value.rich_text.map((text) => text.plain_text).join('')}</span>
				</div>
			);
		case 'toggle':
			return (
				<div key={id} className={styles.toggle}>
					<details>
						<summary>{value.rich_text.map((text) => text.plain_text).join('')}</summary>
						{value.children?.map(renderBlock)}
					</details>
				</div>
			);
		case 'quote':
			return (
				<div key={id} className={styles.blockquote}>
					{value.rich_text.map((text) => text.plain_text).join('')}
				</div>
			);
		case 'code':
			return (
				<div key={id} className={styles.code}>
					<pre>
						<code>{value.rich_text.map((text) => text.plain_text).join('')}</code>
					</pre>
				</div>
			);
		case 'image':
			const src = value.type === 'external' ? value.external.url : value.file.url;
			const caption = value.caption.length ? value.caption[0].plain_text : '';
			return (
				<div key={id} className={styles.image}>
					<figure>
						<img src={src} alt={caption} />
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
			const fileSrc = value.type === 'external' ? value.external.url : value.file.url;
			return (
				<div key={id} className={styles.bookmark}>
					<a href={fileSrc}>{fileSrc}</a>
				</div>
			);
		case 'bookmark':
			return (
				<div key={id} className={styles.bookmark}>
					<a href={value.url}>{value.url}</a>
				</div>
			);
		case 'table':
			return (
				<div key={id} className={styles.table}>
					<table>
						<thead>
							<tr>
								{value.table_width.map((_, i) => (
									<th key={i}>Column {i + 1}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{value.table_rows.map((row, i) => (
								<tr key={i}>
									{row.cells.map((cell, j) => (
										<td key={j}>{cell.rich_text.map((text) => text.plain_text).join('')}</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			);
		case 'video':
		case 'audio':
		case 'embed':
			return (
				<div key={id} className={styles[type]}>
					<iframe src={value.url} frameBorder='0' allowFullScreen></iframe>
				</div>
			);
		case 'callout':
			return (
				<div key={id} className={styles.callout}>
					<div className={styles.calloutIcon}>{value.icon.emoji}</div>
					<div className={styles.calloutText}>{value.rich_text.map((text) => text.plain_text).join('')}</div>
				</div>
			);
		default:
			return <div key={id}>Unsupported block type: {type}</div>;
	}
};

export default function Page({ page, blocks }) {
	if (!page || !blocks) {
		return <div>Loading...</div>;
	}

	const title = page.properties?.이름?.title?.[0]?.plain_text || 'No title';
	const url = page.properties?.URL?.url || 'No URL';
	const tags = page.properties?.태그?.multi_select?.map((tag) => tag.name).join(', ') || 'No tags';

	return (
		<div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.title}>{title}</div>
        <div className={styles.url}>{url}</div>
        <div className={styles.tags}>{tags}</div>
        <div>{blocks.map((block) => renderBlock(block))}</div>
      </div>
    </div>
	);
}
