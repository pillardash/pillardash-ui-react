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
}

export interface Column<T> {
    title: ReactNode;
    value: keyof T | ((data: T) => React.ReactNode);
    width?: string;
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
