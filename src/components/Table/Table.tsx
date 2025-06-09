import { ReactNode } from "react";

import { Pagination } from "./Pagination";
import { TableProps } from "./types";
import { TableSkeleton } from "./TableSkeleton";
import { EmptyStateCard } from "../Cards";

export default function Table<T>({
    data,
    columns,
    itemsPerPage = 20,
    onViewChange,
    totalItems,
    currentPage = 1,
    onPageChange,
    loading = false,
    showPagination = true,
    onRowClick,
}: TableProps<T>) {
    const totalItemsCount = totalItems || data.length;
    const totalPages = Math.ceil(totalItemsCount / itemsPerPage);
    const currentItems = showPagination ? data : data;

    const handleRowClick = (item: T) => {
        if (onRowClick) {
            onRowClick(item);
        }
    };

    return (
        <>
            <div className='relative overflow-x-auto'>
                <table className='w-full'>
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={`bg-gray-100 px-6 py-3 text-left text-sm font-semibold tracking-wider text-gray-500 ${column.width || ""} ${index === 0 ? "rounded-bl-xl rounded-tl-xl" : ""} ${index === columns.length - 1 ? "rounded-br-xl rounded-tr-xl" : ""} `}
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody
                        className={`divide-y divide-gray-200 bg-white 
                            ${ loading ? "opacity-50" : ""} ${onRowClick ? "cursor-pointer" : ""}
                        `}
                    >
                        {loading && <TableSkeleton columns={columns.length} rows={itemsPerPage} />}
                        {currentItems.length > 0
                            ? currentItems.map((item: T, rowIndex) => (
                                  <tr onClick={() => handleRowClick(item)} key={rowIndex} className='hover:bg-gray-50'>
                                      {columns.map((column, colIndex) => (
                                          <td
                                              key={colIndex}
                                              className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800'
                                          >
                                              {typeof column.value === "function"
                                                  ? column.value(item)
                                                  : (item[column.value] as ReactNode)}
                                          </td>
                                      ))}
                                  </tr>
                              ))
                            : !loading && (
                                  <tr>
                                      <td colSpan={columns.length}>
                                          <EmptyStateCard title='No Record found' />
                                      </td>
                                  </tr>
                              )}
                    </tbody>
                </table>
            </div>

            {showPagination && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItemsCount}
                    itemsPerPage={itemsPerPage}
                    onPageChange={onPageChange}
                    onViewChange={onViewChange}
                    loading={loading}
                />
            )}
        </>
    );
}
