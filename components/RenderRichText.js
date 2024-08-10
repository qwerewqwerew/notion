import Link from 'next/link';

const RenderRichText = ({ richTextArray }) => {
	if (!Array.isArray(richTextArray)) return null;

	return richTextArray.map((textObj, index) => {
		//console.log(textObj);
		const { plain_text, href, annotations } = textObj;
		const { bold, italic, strikethrough, underline, code, color } = annotations || {};

		const classes = [bold ? 'bold' : '', italic ? 'italic' : '', strikethrough ? 'line-through' : '', underline ? 'underline' : '', color !== 'default' ? `text-${color}` : '', code ? 'code' : ''].filter(Boolean).join(' ');

		const content = code ? <code>{plain_text}</code> : plain_text;

		if (href) {
			return (
				<Link key={`link-${index}`} href={href} target='_blank'>
					<span className={classes}>{content}</span>
				</Link>
			);
		}

		return (
			<span key={`text-${index}`} className={classes}>
				{content}
			</span>
		);
	});
};

export default RenderRichText;
