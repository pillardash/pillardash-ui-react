export function TableSkeleton({ columns, rows }: { columns: number; rows: number }) {
    return (
        <>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={`skeleton-row-${rowIndex}`}>
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <td
                            key={`skeleton-cell-${rowIndex}-${colIndex}`}
                            className='whitespace-nowrap px-6 py-4'
                        >
                            <div className='h-4 animate-pulse rounded bg-gray-200'></div>
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}
