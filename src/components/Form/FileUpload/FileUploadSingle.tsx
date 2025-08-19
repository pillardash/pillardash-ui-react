import React, { useState } from "react";
import { File, X, AlertCircle, CheckCircle } from "lucide-react";

export interface FileUploadProps {
	onFileChange: (file: File | null) => void;
	direction?: "row" | "col";
	maxFileSize?: string;
	label?: string;
	description?: string;
	helperText?: string;
	error?: string;
	success?: string;
	disabled?: boolean;
	required?: boolean;
	accept?: string;
	multiple?: boolean;
	placeholder?: string;
	showProgress?: boolean;
	className?: string;
	id?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
												   label,
												   description,
												   helperText,
												   error,
												   success,
												   disabled = false,
												   required = false,
												   accept,
												   multiple = false,
												   placeholder,
												   showProgress = true,
												   className = "",
												   id,
												   maxFileSize,
												   onFileChange,
												   direction = "col",
											   }) => {
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isDragOver, setIsDragOver] = useState(false);

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setUploadedFile(file);

			if (showProgress) {
				setUploadProgress(10);
				// Simulate file upload progress
				const interval = setInterval(() => {
					setUploadProgress((prev) => {
						if (prev >= 100) {
							clearInterval(interval);
							return 100;
						}
						return prev + 10;
					});
				}, 300);
			}

			onFileChange(file);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		if (!disabled) {
			setIsDragOver(true);
		}
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragOver(false);

		if (disabled) return;

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const file = e.dataTransfer.files[0];
			setUploadedFile(file);

			if (showProgress) {
				setUploadProgress(10);
				// Simulate file upload progress
				const interval = setInterval(() => {
					setUploadProgress((prev) => {
						if (prev >= 100) {
							clearInterval(interval);
							return 100;
						}
						return prev + 10;
					});
				}, 300);
			}

			onFileChange(file);
		}
	};

	const handleCancelUpload = () => {
		setUploadedFile(null);
		setUploadProgress(0);
		onFileChange(null);
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	const inputId = id || `file-upload-${Math.random().toString(36).substr(2, 9)}`;

	return (
		<div className={`space-y-2 ${className}`}>
			{/* Label */}
			{label && (
				<label
					htmlFor={inputId}
					className="block text-sm font-medium text-gray-700"
				>
					{label}
					{required && <span className="text-red-500 ml-1">*</span>}
				</label>
			)}

			{/* Description */}
			{description && (
				<p className="text-sm text-gray-600">{description}</p>
			)}

			{/* File Upload Area */}
			{!uploadedFile ? (
				<div
					className={`
                        flex flex-${direction} gap-2 rounded-lg border-2 border-dashed p-8 text-center items-center
                        ${direction === "row" ? "justify-center" : ""}
                        ${isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300"}
                        ${error ? "border-red-300 bg-red-50" : ""}
                        ${success ? "border-green-300 bg-green-50" : ""}
                        ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer hover:border-gray-400"}
                    `}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					onClick={() => !disabled && document.getElementById(inputId)?.click()}
				>
					<p className={`text-sm ${disabled ? "text-gray-400" : "text-primary-700 hover:underline"}`}>
						{placeholder || "Click to Upload"}
					</p>
					<input
						id={inputId}
						type="file"
						className="hidden"
						onChange={handleFileUpload}
						accept={accept}
						multiple={multiple}
						disabled={disabled}
						required={required}
					/>
					<p className="text-gray-900 text-sm">or drag and drop</p>
					<p className="text-sm text-gray-500">
						(Max. File size: {maxFileSize || '25'} MB)
					</p>
				</div>
			) : (
				/* Uploaded File Display */
				<div className={`rounded-lg border p-4 ${success ? "border-green-300 bg-green-50" : "border-gray-200"}`}>
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<div className="mr-3 rounded-lg bg-primary-100 p-2 w-12 h-12 flex items-center justify-center overflow-hidden">
								{uploadedFile.type.startsWith("image/") ? (
									<img
										src={URL.createObjectURL(uploadedFile)}
										alt="preview"
										width={48}
										height={48}
										className="object-cover w-full h-full rounded"
									/>
								) : uploadedFile.type === "application/pdf" ? (
									<iframe
										src={URL.createObjectURL(uploadedFile)}
										title="PDF icon preview"
										className="w-full h-full rounded"
									/>
								) : (
									<File size={24} className="text-primary-500" />
								)}
							</div>
							<div>
								<p className="text-sm font-medium">{uploadedFile.name}</p>
								<p className="text-xs text-gray-500">{formatFileSize(uploadedFile.size)}</p>
							</div>
						</div>
						<button
							onClick={handleCancelUpload}
							className="text-red-500 hover:text-red-700 disabled:opacity-50"
							disabled={disabled}
						>
							<X size={16} />
						</button>
					</div>

					{/* Progress Bar */}
					{showProgress && uploadProgress < 100 && (
						<>
							<div className="h-2.5 w-full rounded-full bg-secondary-200">
								<div
									className="h-2.5 rounded-full bg-primary-800 transition-all duration-300"
									style={{ width: `${uploadProgress}%` }}
								></div>
							</div>
							<p className="mt-1 text-right text-xs text-gray-500">
								{uploadProgress}%
							</p>
						</>
					)}

					{/* Success indicator */}
					{showProgress && uploadProgress === 100 && (
						<div className="flex items-center text-green-600 text-sm">
							<CheckCircle size={16} className="mr-1" />
							Upload complete
						</div>
					)}
				</div>
			)}

			{/* Helper Text */}
			{helperText && !error && !success && (
				<p className="text-sm text-gray-500">{helperText}</p>
			)}

			{/* Error Message */}
			{error && (
				<div className="flex items-center text-red-600 text-sm">
					<AlertCircle size={16} className="mr-1" />
					{error}
				</div>
			)}

			{/* Success Message */}
			{success && (
				<div className="flex items-center text-green-600 text-sm">
					<CheckCircle size={16} className="mr-1" />
					{success}
				</div>
			)}
		</div>
	);
};

export default FileUpload;