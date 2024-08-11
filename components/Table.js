import RenderRichText from './RenderRichText';

const Table = ({ block, childBlocks }) => {
	const { table } = block;

	if (!table || !childBlocks) {
		return null;
	}

	const tableRows = childBlocks.filter((child) => child.type === 'table_row');

	return (
		<table className='table table-bordered mb-3'>
			<thead>
				{table.has_column_header && (
					<tr>
						{tableRows[0]?.table_row.cells.map((cell, index) => (
							<th key={index}>
								<RenderRichText richTextArray={cell} />
							</th>
						))}
					</tr>
				)}
			</thead>
			<tbody>
				{tableRows.map((row, rowIndex) => (
					<TableRow key={row.id} cells={row.table_row.cells} rowIndex={rowIndex} hasColumnHeader={table.has_column_header} />
				))}
			</tbody>
		</table>
	);
};

const TableRow = ({ cells, rowIndex, hasColumnHeader }) => {
	return (
		<tr>
			{cells.map((cell, index) => (
				<td key={index}>
					<RenderRichText richTextArray={cell} />
				</td>
			))}
		</tr>
	);
};

export default Table;
