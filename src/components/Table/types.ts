import React, { ReactNode } from "react";

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: ReactNode;
  subtitle?: string;
  itemsPerPage?: number;
  currentView?: string;
  onViewChange?: (view: string) => void;
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  showPagination?: boolean;
  onRowClick?: (item: T) => void;
  useCardLayout?: boolean;
  emptyState?: ReactNode;
}

export interface Column<T> {
  title: ReactNode;
  value: keyof T | ((data: T) => React.ReactNode);
  width?: string;
  sortable?: boolean;
  sortKey?: keyof T | string;
  align?: "left" | "center" | "right";
  className?: string;
}

export interface ExpandableTableProps<T> extends TableProps<T> {
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
  defaultSortKey?: string;
  defaultSortOrder?: "asc" | "desc";
  onSort?: (sortKey: string, sortOrder: "asc" | "desc") => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange?: (page: number) => void;
  onViewChange?: (itemsPerPage: string) => void;
  loading?: boolean;
}

export type TableDropdownProps = {
  actions: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    variant?: "default" | "danger";
  }[];
  trigger?: React.ReactNode;
  className?: string;
  dropdownClassName?: string;
};
