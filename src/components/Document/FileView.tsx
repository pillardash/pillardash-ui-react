import React, { useState } from "react";
import {
    File,
    Edit3,
    Trash2,
    Eye,
    Download,
    FileText,
    FileImage,
    Video,
    Music,
    Archive,
} from "lucide-react";
import FileUpload from "../Form/FileUpload/FileUpload";

// Types
export interface FileItem {
    id?: string;
    name: string;
    size: number;
    type: string;
    url?: string;
    file?: File;
    uploadProgress?: number;
}

export interface FileViewProps {
    file: FileItem | null;
    onDelete?: () => void;
    onUpdate?: () => void;
    onView?: () => void;
    onDownload?: () => void;
    showActions?: boolean;
    showDelete?: boolean;
    showUpdate?: boolean;
    showView?: boolean;
    showDownload?: boolean;
    layout?: "grid" | "list";
    maxPreviewSize?: number;
    className?: string;
}

const FileView: React.FC<FileViewProps> = ({
                                               file,
                                               onDelete,
                                               onUpdate,
                                               onView,
                                               onDownload,
                                               showActions = true,
                                               showDelete = true,
                                               showUpdate = true,
                                               showView = true,
                                               showDownload = false,
                                               layout = "grid",
                                               maxPreviewSize = 200,
                                               className = ""
                                           }) => {
    const [isHovered, setIsHovered] = useState(false);

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith('image/')) return FileImage;
        if (fileType.startsWith('video/')) return Video;
        if (fileType.startsWith('audio/')) return Music;
        if (fileType === 'application/pdf') return FileText;
        if (fileType.includes('zip') || fileType.includes('rar')) return Archive;
        return File;
    };

    const getFilePreview = (file: FileItem) => {
        const previewUrl = file.url || (file.file ? URL.createObjectURL(file.file) : null);

        if (!previewUrl) {
            const IconComponent = getFileIcon(file.type);
            return <IconComponent size={32} className="text-gray-400" />;
        }

        if (file.type.startsWith('image/')) {
            return (
                <img
                    src={previewUrl}
                    alt={file.name}
                    className="w-full h-full object-cover"
                    style={{ maxWidth: maxPreviewSize, maxHeight: maxPreviewSize }}
                />
            );
        }

        if (file.type === 'application/pdf') {
            return (
                <div className="w-full h-full flex items-center justify-center bg-red-50">
                    <div className="text-center">
                        <FileText size={32} className="text-red-600 mx-auto mb-1" />
                        <span className="text-xs text-red-600 font-medium">PDF</span>
                    </div>
                </div>
            );
        }

        const IconComponent = getFileIcon(file.type);
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <IconComponent size={32} className="text-gray-400" />
            </div>
        );
    };

    if (!file) {
        return (
            <div className={`text-center py-8 text-gray-500 ${className}`}>
                <File size={48} className="mx-auto mb-2 text-gray-300" />
                <p>No file to display</p>
            </div>
        );
    }

    if (layout === "list") {
        return (
            <div className={`${className}`}>
                <div
                    className="flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 mr-3">
                        {getFilePreview(file)}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>

                        {/* Upload Progress */}
                        {file.uploadProgress !== undefined && file.uploadProgress < 100 && (
                            <div className="mt-2">
                                <div className="h-1.5 w-full rounded-full bg-gray-200">
                                    <div
                                        className="h-1.5 rounded-full bg-blue-600 transition-all duration-300"
                                        style={{ width: `${file.uploadProgress}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{file.uploadProgress}%</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    {showActions && (isHovered || file.uploadProgress === undefined) && (
                        <div className="flex items-center space-x-2">
                            {showView && onView && (
                                <button
                                    onClick={onView}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                    title="View"
                                >
                                    <Eye size={16} />
                                </button>
                            )}
                            {showDownload && onDownload && (
                                <button
                                    onClick={onDownload}
                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                    title="Download"
                                >
                                    <Download size={16} />
                                </button>
                            )}
                            {showUpdate && onUpdate && (
                                <button
                                    onClick={onUpdate}
                                    className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors"
                                    title="Update"
                                >
                                    <Edit3 size={16} />
                                </button>
                            )}
                            {showDelete && onDelete && (
                                <button
                                    onClick={onDelete}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Grid Layout (Single File)
    return (
        <div className={`flex justify-center ${className}`}>
            <div
                className="group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden max-w-xs"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* File Preview */}
                <div className="aspect-square w-full bg-gray-50 overflow-hidden">
                    {getFilePreview(file)}

                    {/* Upload Progress Overlay */}
                    {file.uploadProgress !== undefined && file.uploadProgress < 100 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="text-center text-white">
                                <div className="w-16 h-16 rounded-full border-4 border-white border-t-transparent animate-spin mb-2"></div>
                                <p className="text-sm">{file.uploadProgress}%</p>
                            </div>
                        </div>
                    )}

                    {/* Actions Overlay */}
                    {showActions && (isHovered || file.uploadProgress === undefined) && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="flex space-x-2">
                                {showView && onView && (
                                    <button
                                        onClick={onView}
                                        className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 rounded-full transition-all"
                                        title="View"
                                    >
                                        <Eye size={16} />
                                    </button>
                                )}
                                {showDownload && onDownload && (
                                    <button
                                        onClick={onDownload}
                                        className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 rounded-full transition-all"
                                        title="Download"
                                    >
                                        <Download size={16} />
                                    </button>
                                )}
                                {showUpdate && onUpdate && (
                                    <button
                                        onClick={onUpdate}
                                        className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 rounded-full transition-all"
                                        title="Update"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                )}
                                {showDelete && onDelete && (
                                    <button
                                        onClick={onDelete}
                                        className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-red-600 rounded-full transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* File Info */}
                <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                        {file.name}
                    </p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
            </div>
        </div>
    );
};

export default FileView;