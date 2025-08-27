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
                                     useCardLayout = false,
                                     emptyState,
                                 }: TableProps<T>) {
    const totalItemsCount = totalItems || data.length;
    const totalPages = Math.ceil(totalItemsCount / itemsPerPage);
    const currentItems = showPagination ? data : data;

    const handleRowClick = (item: T) => {
        if (onRowClick) {
            onRowClick(item);
        }
    };

    // Default empty state component
    const defaultEmptyState = (
        <EmptyStateCard title="No Record found" />
    );

    const renderCardLayout = () => (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {loading && (
                // Card skeleton for loading state
                Array.from({ length: itemsPerPage }).map((_, index) => (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                        <div className="space-y-3">
                            {columns.slice(0, 3).map((_, colIndex) => (
                                <div key={colIndex} className="flex justify-between items-center">
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
            {currentItems.length > 0
                ? currentItems.map((item: T, rowIndex) => (
                    <div
                        key={rowIndex}
                        onClick={() => handleRowClick(item)}
                        className={`bg-white rounded-lg border border-gray-200 p-4 transition-all duration-200 hover:shadow-md hover:border-gray-300 ${
                            onRowClick ? "cursor-pointer" : ""
                        } ${loading ? "opacity-50" : ""}`}
                    >
                        <div className="space-y-3">
                            {columns.map((column, colIndex) => (
                                <div key={colIndex} className="flex justify-between items-start">
                                      <span className="text-sm font-medium text-gray-500 flex-shrink-0 mr-3">
                                          {column.title}:
                                      </span>
                                    <span className="text-sm text-gray-800 text-right">
                                          {typeof column.value === "function"
                                              ? column.value(item)
                                              : (item[column.value] as ReactNode)}
                                      </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
                : !loading && (
                <div className="col-span-full">
                    {emptyState || defaultEmptyState}
                </div>
            )}
        </div>
    );

    const renderTableLayout = () => (
        <div className="relative overflow-x-auto">
            <table className="w-full">
                <thead>
                <tr>
                    {columns.map((column, index) => (
                        <th
                            key={index}
                            className={`bg-gray-100 px-6 py-3 text-left text-sm font-semibold tracking-wider text-gray-500 ${
                                column.width || ""
                            } ${index === 0 ? "rounded-bl-xl rounded-tl-xl" : ""} ${
                                index === columns.length - 1 ? "rounded-br-xl rounded-tr-xl" : ""
                            } `}
                        >
                            {column.title}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody
                    className={`divide-y divide-gray-200 bg-white 
                        ${loading ? "opacity-50" : ""} ${onRowClick ? "cursor-pointer" : ""}
                    `}
                >
                {loading && <TableSkeleton columns={columns.length} rows={itemsPerPage} />}
                {currentItems.length > 0
                    ? currentItems.map((item: T, rowIndex) => (
                        <tr onClick={() => handleRowClick(item)} key={rowIndex} className="hover:bg-gray-50">
                            {columns.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800"
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
                        <td colSpan={columns.length} className="px-6 py-12 text-center">
                            {emptyState || defaultEmptyState}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );

    return (
        <>
            {/* Responsive layout: Card on mobile, Table on desktop (unless useCardLayout is true) */}
            {useCardLayout ? (
                renderCardLayout()
            ) : (
                <>
                    <div className="hidden md:block">
                        {renderTableLayout()}
                    </div>
                    <div className="block md:hidden">
                        {renderCardLayout()}
                    </div>
                </>
            )}

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