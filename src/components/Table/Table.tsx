import { ReactNode, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { Pagination } from "./Pagination";
import { TableProps, ExpandableTableProps } from "./types";
import { TableSkeleton } from "./TableSkeleton";
import { EmptyStateCard } from "../Cards";

type SortOrder = "asc" | "desc" | null;

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
  defaultSortKey,
  defaultSortOrder = "asc",
  onSort,
}: ExpandableTableProps<T>) {
  const [expandedRows, setExpandedRows] =
    useState<Set<string | number>>(defaultExpandedRows);
  const [sortKey, setSortKey] = useState<string | null>(defaultSortKey || null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    defaultSortKey ? defaultSortOrder : null,
  );

  // Pagination calculations
  const totalItemsCount = paginationMeta?.total || totalItems || data.length;
  const totalPages =
    paginationMeta?.last_page || Math.ceil(totalItemsCount / itemsPerPage);
  const currentPageNumber = paginationMeta?.current_page || currentPage;
  const perPage = paginationMeta?.per_page || itemsPerPage;

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortKey || !sortOrder) return data;

    const sorted = [...data].sort((a, b) => {
      const column = columns.find(
        (col) => (col.sortKey || col.value) === sortKey,
      );
      if (!column) return 0;

      let aValue: any;
      let bValue: any;

      if (typeof column.value === "function") {
        // For function-based columns, use the sortKey to get raw values
        aValue = (a as any)[sortKey];
        bValue = (b as any)[sortKey];
      } else {
        aValue = a[column.value];
        bValue = b[column.value];
      }

      // Handle null/undefined
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Handle different types
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Default comparison
      return sortOrder === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    return sorted;
  }, [data, sortKey, sortOrder, columns]);

  const currentItems = sortedData;

  // Sorting handler
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    const key = String(column.sortKey || column.value);
    let newOrder: SortOrder = "asc";

    if (sortKey === key) {
      if (sortOrder === "asc") newOrder = "desc";
      else if (sortOrder === "desc") newOrder = null;
      else newOrder = "asc";
    }

    setSortKey(newOrder ? key : null);
    setSortOrder(newOrder);

    if (onSort && newOrder) {
      onSort(key, newOrder);
    }
  };

  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    const key = String(column.sortKey || column.value);
    if (sortKey !== key) {
      return <ArrowUpDown size={14} className="text-gray-400" />;
    }

    return sortOrder === "asc" ? (
      <ArrowUp size={14} className="text-blue-600" />
    ) : (
      <ArrowDown size={14} className="text-blue-600" />
    );
  };

  // Row expansion logic
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

  const defaultEmptyState = <EmptyStateCard title="No Record found" />;

  const getAlignmentClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  // Card Layout Renderer
  const renderCardLayout = () => (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {loading &&
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

  // Table Layout Renderer
  const renderTableLayout = () => (
    <div className="relative overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            {expandableRows && (
              <th className="bg-gray-100 px-6 py-3 text-left text-sm font-semibold tracking-wider text-gray-500 w-12 rounded-bl-xl rounded-tl-xl">
                {/* Toggle column */}
              </th>
            )}
            {columns.map((column, index) => (
              <th
                key={index}
                onClick={() => handleSort(column)}
                className={`bg-gray-100 px-6 py-3 text-sm font-semibold tracking-wider text-gray-500 ${
                  column.width || ""
                } ${getAlignmentClass(column.align)} ${
                  column.sortable
                    ? "cursor-pointer select-none hover:bg-gray-200"
                    : ""
                } ${!expandableRows && index === 0 ? "rounded-bl-xl rounded-tl-xl" : ""} ${
                  index === columns.length - 1
                    ? "rounded-br-xl rounded-tr-xl"
                    : ""
                } ${column.className || ""}`}
                style={column.width ? { width: column.width } : undefined}
              >
                <div className="flex items-center gap-2 justify-between">
                  <span>{column.title}</span>
                  {getSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={`divide-y divide-gray-200 bg-white ${loading ? "opacity-50" : ""} ${
            onRowClick || expandableRows ? "cursor-pointer" : ""
          }`}
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
                  <React.Fragment key={rowIndex}>
                    <tr
                      onClick={() => handleRowClick(item, rowIndex)}
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
                          className={`whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 ${getAlignmentClass(
                            column.align,
                          )} ${column.className || ""}`}
                          style={
                            column.width ? { width: column.width } : undefined
                          }
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
                  </React.Fragment>
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
