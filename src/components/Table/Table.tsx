import { ReactNode, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { Pagination } from "./Pagination";
import { TableProps } from "./types";
import { TableSkeleton } from "./TableSkeleton";
import { EmptyStateCard } from "../Cards";

// Extended interface to support row toggling
interface ExpandableTableProps<T> extends TableProps<T> {
  expandableRows?: boolean;
  expandedRowRender?: (item: T) => ReactNode;
  onRowToggle?: (item: T, isExpanded: boolean) => void;
  defaultExpandedRows?: Set<string | number>;
  getRowKey?: (item: T, index: number) => string | number;
  paginationMeta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

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
  expandableRows = false,
  expandedRowRender,
  onRowToggle,
  defaultExpandedRows = new Set(),
  getRowKey = (item: T, index: number) => index,
  paginationMeta,
}: ExpandableTableProps<T>) {
  const [expandedRows, setExpandedRows] =
    useState<Set<string | number>>(defaultExpandedRows);

  // Use Laravel pagination meta if available, otherwise fallback to props
  const totalItemsCount = paginationMeta?.total || totalItems || data.length;
  const totalPages =
    paginationMeta?.last_page || Math.ceil(totalItemsCount / itemsPerPage);
  const currentPageNumber = paginationMeta?.current_page || currentPage;
  const perPage = paginationMeta?.per_page || itemsPerPage;
  const currentItems = showPagination ? data : data;

  const handleRowClick = (item: T, index: number) => {
    if (expandableRows && expandedRowRender) {
      toggleRow(item, index);
    } else if (onRowClick) {
      onRowClick(item);
    }
  };

  const toggleRow = (item: T, index: number) => {
    const rowKey = getRowKey(item, index);
    const newExpandedRows = new Set(expandedRows);
    const isCurrentlyExpanded = expandedRows.has(rowKey);

    if (isCurrentlyExpanded) {
      newExpandedRows.delete(rowKey);
    } else {
      newExpandedRows.add(rowKey);
    }

    setExpandedRows(newExpandedRows);

    if (onRowToggle) {
      onRowToggle(item, !isCurrentlyExpanded);
    }
  };

  const isRowExpanded = (item: T, index: number) => {
    const rowKey = getRowKey(item, index);
    return expandedRows.has(rowKey);
  };

  // Default empty state component
  const defaultEmptyState = <EmptyStateCard title="No Record found" />;

  const renderCardLayout = () => (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {loading &&
        // Card skeleton for loading state
        Array.from({ length: perPage }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse"
          >
            <div className="space-y-3">
              {columns.slice(0, 3).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="flex justify-between items-center"
                >
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      {currentItems.length > 0
        ? currentItems.map((item: T, rowIndex) => {
            const expanded = isRowExpanded(item, rowIndex);
            return (
              <div
                key={rowIndex}
                className="bg-white rounded-lg border border-gray-200"
              >
                <div
                  onClick={() => handleRowClick(item, rowIndex)}
                  className={`p-4 transition-all duration-200 hover:shadow-md hover:border-gray-300 ${
                    onRowClick || expandableRows ? "cursor-pointer" : ""
                  } ${loading ? "opacity-50" : ""} ${
                    expandableRows
                      ? "border-b border-gray-100 last:border-b-0"
                      : ""
                  }`}
                >
                  <div className="space-y-3">
                    {expandableRows && (
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center text-sm text-gray-500">
                          {expanded ? (
                            <ChevronDown size={16} className="mr-1" />
                          ) : (
                            <ChevronRight size={16} className="mr-1" />
                          )}
                          <span>
                            {expanded ? "Hide details" : "Show details"}
                          </span>
                        </div>
                      </div>
                    )}
                    {columns.map((column, colIndex) => (
                      <div
                        key={colIndex}
                        className="flex justify-between items-start"
                      >
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
                {expandableRows && expanded && expandedRowRender && (
                  <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-lg">
                    {expandedRowRender(item)}
                  </div>
                )}
              </div>
            );
          })
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
            {expandableRows && (
              <th className="bg-gray-100 px-6 py-3 text-left text-sm font-semibold tracking-wider text-gray-500 w-12 rounded-bl-xl rounded-tl-xl">
                {/* Toggle column header */}
              </th>
            )}
            {columns.map((column, index) => (
              <th
                key={index}
                className={`bg-gray-100 px-6 py-3 text-left text-sm font-semibold tracking-wider text-gray-500 ${
                  column.width || ""
                } ${!expandableRows && index === 0 ? "rounded-bl-xl rounded-tl-xl" : ""} ${
                  index === columns.length - 1
                    ? "rounded-br-xl rounded-tr-xl"
                    : ""
                } `}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={`divide-y divide-gray-200 bg-white
                        ${loading ? "opacity-50" : ""} ${onRowClick || expandableRows ? "cursor-pointer" : ""}
                    `}
        >
          {loading && (
            <TableSkeleton
              columns={columns.length + (expandableRows ? 1 : 0)}
              rows={perPage}
            />
          )}
          {currentItems.length > 0
            ? currentItems.map((item: T, rowIndex) => {
                const expanded = isRowExpanded(item, rowIndex);
                return (
                  <>
                    <tr
                      onClick={() => handleRowClick(item, rowIndex)}
                      key={rowIndex}
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        expanded ? "bg-blue-50" : ""
                      }`}
                    >
                      {expandableRows && (
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                          <div className="flex items-center justify-center">
                            {expanded ? (
                              <ChevronDown
                                size={16}
                                className="text-gray-500"
                              />
                            ) : (
                              <ChevronRight
                                size={16}
                                className="text-gray-500"
                              />
                            )}
                          </div>
                        </td>
                      )}
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
                    {expandableRows && expanded && expandedRowRender && (
                      <tr key={`${rowIndex}-expanded`} className="bg-gray-50">
                        <td colSpan={columns.length + 1} className="px-6 py-4">
                          <div className="animate-fade-in">
                            {expandedRowRender(item)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            : !loading && (
                <tr>
                  <td
                    colSpan={columns.length + (expandableRows ? 1 : 0)}
                    className="px-6 py-12 text-center"
                  >
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
          <div className="hidden md:block">{renderTableLayout()}</div>
          <div className="block md:hidden">{renderCardLayout()}</div>
        </>
      )}

      {showPagination && (
        <Pagination
          currentPage={currentPageNumber}
          totalPages={totalPages}
          totalItems={totalItemsCount}
          itemsPerPage={perPage}
          onPageChange={onPageChange}
          onViewChange={onViewChange}
          loading={loading}
        />
      )}
    </>
  );
}
