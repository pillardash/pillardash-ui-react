import { useEffect, useRef, useState } from "react";

import { ChevronDown, Download, FileSpreadsheet, FileText } from "lucide-react";

export enum ExportFormatEnum {
    PDF,
    CSV,
    EXCEL,
    JSON,
}
export default function ExportButton() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleExport = (format: ExportFormatEnum) => {
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className='relative inline-block' ref={dropdownRef}>
            <div className='flex'>
                <button
                    className='flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none'
                    onClick={() => handleExport(ExportFormatEnum.PDF)}
                >
                    <Download className='mr-2 h-4 w-4' />
                    Export
                </button>
                <button
                    className='rounded-r-md border border-l-0 border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none'
                    onClick={toggleDropdown}
                >
                    <ChevronDown className='h-4 w-4' />
                </button>
            </div>

            {isOpen && (
                <div className='absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <div className='py-1'>
                        <button
                            onClick={() => handleExport(ExportFormatEnum.PDF)}
                            className='flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'
                        >
                            <FileText className='mr-2 h-4 w-4' />
                            PDF Document
                        </button>
                        <button
                            onClick={() => handleExport(ExportFormatEnum.CSV)}
                            className='flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'
                        >
                            <FileSpreadsheet className='mr-2 h-4 w-4' />
                            CSV Spreadsheet
                        </button>
                        <button
                            onClick={() => handleExport(ExportFormatEnum.EXCEL)}
                            className='flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'
                        >
                            <FileSpreadsheet className='mr-2 h-4 w-4' />
                            Excel Spreadsheet
                        </button>
                        {/*<button*/}
                        {/*    onClick={() => handleExport(ExportFormatEnum.JSON)}*/}
                        {/*    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"*/}
                        {/*>*/}
                        {/*    <File className="w-4 h-4 mr-2" />*/}
                        {/*    JSON File*/}
                        {/*</button>*/}
                    </div>
                </div>
            )}
        </div>
    );
}
