import React, { useState } from "react";
import { AlertCircle, CheckCircle, Upload } from "lucide-react";
import {FileItem, FileView} from "../../Document";

export interface FileUploadProps {
	onFileChange: (files: File[] | null) => void;
	existingFiles?: FileItem[];
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
	replaceMode?: boolean; // When true, single file replaces existing
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
												   existingFiles = [],
												   direction = "col",
												   replaceMode,
											   }) => {
	const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
	const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
	const [isDragOver, setIsDragOver] = useState(false);

	// Determine if we're in replace mode (single file replacement)
	const isReplaceMode = replaceMode ?? (!multiple && existingFiles.length > 0);

	// Get the current file to display (for single file mode)
	const getCurrentFile = (): FileItem | null => {
		if (!multiple) {
			// Single file mode - prioritize uploaded file, then existing
			if (uploadedFiles.length > 0) {
				const file = uploadedFiles[0];
				return {
					name: file.name,
					size: file.size,
					type: file.type,
					file,
					uploadProgress: uploadProgress[`${file.name}-${file.size}`] || 100
				};
			} else if (existingFiles.length > 0) {
				return existingFiles[0];
			}
		}
		return null;
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const newFiles = Array.from(e.target.files);

			let updatedFiles: File[];
			if (!multiple) {
				// Single file mode - replace existing
				updatedFiles = [newFiles[0]];
			} else {
				// Multiple file mode - add to existing
				updatedFiles = [...uploadedFiles, ...newFiles];
			}

			setUploadedFiles(updatedFiles);

			if (showProgress) {
				newFiles.forEach(file => {
					const fileKey = `${file.name}-${file.size}`;
					setUploadProgress(prev => ({ ...prev, [fileKey]: 10 }));

					const interval = setInterval(() => {
						setUploadProgress(prev => {
							const currentProgress = prev[fileKey] || 0;
							if (currentProgress >= 100) {
								clearInterval(interval);
								return prev;
							}
							return { ...prev, [fileKey]: Math.min(currentProgress + 10, 100) };
						});
					}, 300);
				});
			}

			onFileChange(updatedFiles);
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

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			const newFiles = Array.from(e.dataTransfer.files);

			let updatedFiles: File[];
			if (!multiple) {
				// Single file mode - replace existing
				updatedFiles = [newFiles[0]];
			} else {
				// Multiple file mode - add to existing
				updatedFiles = [...uploadedFiles, ...newFiles];
			}

			setUploadedFiles(updatedFiles);

			if (showProgress) {
				newFiles.forEach(file => {
					const fileKey = `${file.name}-${file.size}`;
					setUploadProgress(prev => ({ ...prev, [fileKey]: 10 }));

					const interval = setInterval(() => {
						setUploadProgress(prev => {
							const currentProgress = prev[fileKey] || 0;
							if (currentProgress >= 100) {
								clearInterval(interval);
								return prev;
							}
							return { ...prev, [fileKey]: Math.min(currentProgress + 10, 100) };
						});
					}, 300);
				});
			}

			onFileChange(updatedFiles);
		}
	};

	const handleDeleteFile = () => {
		// Remove the uploaded file
		setUploadedFiles([]);
		setUploadProgress({});
		onFileChange(null);
	};

	const handleReplaceFile = () => {
		// Trigger file input for replacement
		document.getElementById(inputId)?.click();
	};

	const inputId = id || `file-upload-${Math.random().toString(36).substr(2, 9)}`;
	const currentFile = getCurrentFile();

	return (
		<div className={`space-y-4 ${className}`}>
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

			{/* Single File Display */}
			{!multiple && currentFile ? (
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<h4 className="text-sm font-medium text-gray-700">
							{uploadedFiles.length > 0 ? "New File" : "Current File"}
						</h4>
						<button
							onClick={handleReplaceFile}
							className="text-sm text-blue-600 hover:text-blue-800 font-medium"
							disabled={disabled}
						>
							Replace
						</button>
					</div>

					<FileView
						file={currentFile}
						onDelete={handleDeleteFile}
						showUpdate={false}
						showView={true}
						showDelete={true}
						layout="list"
						className="max-w-md"
					/>

					{/* Hidden file input for replacement */}
					<input
						id={inputId}
						type="file"
						className="hidden"
						onChange={handleFileUpload}
						accept={accept}
						disabled={disabled}
						required={required}
					/>
				</div>
			) : multiple && existingFiles.length > 0 ? (
				/* Multiple File Mode with Existing Files */
				<div className="space-y-4">
					<div className="mb-4">
						<h4 className="text-sm font-medium text-gray-700 mb-2">
							Current Files ({existingFiles.length})
						</h4>
						{existingFiles.map((file, index) => (
							<div key={file.id || index} className="mb-2">
								<FileView
									file={file}
									showDelete={false}
									showUpdate={false}
									layout="list"
								/>
							</div>
						))}
					</div>

					{/* File Upload Area for Multiple Mode */}
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
						<Upload size={24} className="text-gray-400" />
						<div>
							<p className={`text-sm font-medium ${disabled ? "text-gray-400" : "text-blue-600 hover:underline"}`}>
								{placeholder || "Add more files"}
							</p>
							<p className="text-gray-500 text-sm">or drag and drop</p>
							<p className="text-sm text-gray-500">
								(Max. File size: {maxFileSize || '25'} MB)
							</p>
							<p className="text-xs text-gray-400 mt-1">
								Multiple files allowed
							</p>
						</div>
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
					</div>

					{/* New Uploaded Files */}
					{uploadedFiles.length > 0 && (
						<div className="mt-4">
							<div className="flex items-center justify-between mb-2">
								<h4 className="text-sm font-medium text-gray-700">
									New Files ({uploadedFiles.length})
								</h4>
								<button
									onClick={() => {
										setUploadedFiles([]);
										setUploadProgress({});
										onFileChange(null);
									}}
									className="text-xs text-red-500 hover:text-red-700"
									disabled={disabled}
								>
									Remove All New Files
								</button>
							</div>

							{uploadedFiles.map((file, index) => (
								<div key={`${file.name}-${file.size}`} className="mb-2">
									<FileView
										file={{
											name: file.name,
											size: file.size,
											type: file.type,
											file,
											uploadProgress: uploadProgress[`${file.name}-${file.size}`] || 100
										}}
										onDelete={() => {
											const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
											setUploadedFiles(updatedFiles);
											onFileChange(updatedFiles.length > 0 ? updatedFiles : null);
										}}
										showUpdate={false}
										showView={false}
										layout="list"
									/>
								</div>
							))}
						</div>
					)}
				</div>
			) : (
				/* File Upload Area - No Files */
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
					<Upload size={24} className="text-gray-400" />
					<div>
						<p className={`text-sm font-medium ${disabled ? "text-gray-400" : "text-blue-600 hover:underline"}`}>
							{placeholder ||
								(!multiple && existingFiles.length > 0 ? "Replace file" :
									existingFiles.length > 0 ? "Add more files" : "Click to Upload")
							}
						</p>
						<p className="text-gray-500 text-sm">or drag and drop</p>
						<p className="text-sm text-gray-500">
							(Max. File size: {maxFileSize || '25'} MB)
						</p>
						{multiple ? (
							<p className="text-xs text-gray-400 mt-1">
								Multiple files allowed
							</p>
						) : (
							<p className="text-xs text-gray-400 mt-1">
								Single file only
							</p>
						)}
					</div>
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

export function FileUploadDemo() {
	const [singleFile, setSingleFile] = useState<File[] | null>(null);
	const [multipleFiles, setMultipleFiles] = useState<File[] | null>(null);
	const [imageFiles, setImageFiles] = useState<File[] | null>(null);

	return (
		<div className="max-w-2xl mx-auto p-6 space-y-8">
			<h1 className="text-2xl font-bold text-gray-800">File Upload Component Demo</h1>

			{/* Single File Upload */}
			<div>
				<h2 className="text-lg font-semibold mb-4">Single File Upload</h2>
				<FileUpload
					label="Upload Document"
					description="Upload a single document file"
					helperText="Supported formats: PDF, DOC, DOCX"
					accept=".pdf,.doc,.docx"
					multiple={false}
					onFileChange={setSingleFile}
					maxFileSize="10"
				/>
				{singleFile && (
					<div className="mt-4 p-3 bg-gray-50 rounded">
						<p className="text-sm"><strong>Selected:</strong> {singleFile[0]?.name}</p>
					</div>
				)}
			</div>

			{/* Multiple File Upload */}
			<div>
				<h2 className="text-lg font-semibold mb-4">Multiple File Upload</h2>
				<FileUpload
					label="Upload Multiple Files"
					description="You can upload multiple files at once"
					helperText="Hold Ctrl/Cmd to select multiple files"
					multiple={true}
					onFileChange={setMultipleFiles}
					placeholder="Choose multiple files"
				/>
				{multipleFiles && (
					<div className="mt-4 p-3 bg-gray-50 rounded">
						<p className="text-sm"><strong>Selected {multipleFiles.length} files:</strong></p>
						<ul className="text-xs mt-1">
							{multipleFiles.map((file, i) => (
								<li key={i}>• {file.name}</li>
							))}
						</ul>
					</div>
				)}
			</div>

			{/* Image Upload */}
			<div>
				<h2 className="text-lg font-semibold mb-4">Image Upload</h2>
				<FileUpload
					label="Upload Images"
					description="Upload one or more image files"
					accept="image/*"
					multiple={true}
					onFileChange={setImageFiles}
					placeholder="Choose images"
					direction="row"
				/>
				{imageFiles && (
					<div className="mt-4 p-3 bg-gray-50 rounded">
						<p className="text-sm"><strong>Selected {imageFiles.length} image(s):</strong></p>
						<ul className="text-xs mt-1">
							{imageFiles.map((file, i) => (
								<li key={i}>• {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
							))}
						</ul>
					</div>
				)}
			</div>

			{/* With Error State */}
			<div>
				<h2 className="text-lg font-semibold mb-4">With Error State</h2>
				<FileUpload
					label="Upload with Error"
					error="File size too large. Please select a file smaller than 5MB."
					onFileChange={() => {}}
				/>
			</div>

			{/* With Success State */}
			<div>
				<h2 className="text-lg font-semibold mb-4">With Success State</h2>
				<FileUpload
					label="Upload with Success"
					success="Files uploaded successfully!"
					onFileChange={() => {}}
				/>
			</div>
		</div>
	);
}