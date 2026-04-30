import React from "react";
import type { Editor } from "@tiptap/react";
import { ImagePlus } from "lucide-react";

import { ToolbarButton } from "./toolbar";

interface ImagePopoverProps {
    editor: Editor;
    onImageUpload?: (file: File) => Promise<{ url: string; assetId?: string }>;
}

const ImagePopover: React.FC<ImagePopoverProps> = ({ editor, onImageUpload }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [src, setSrc] = React.useState("");
    const [alt, setAlt] = React.useState("");
    const [isUploading, setIsUploading] = React.useState(false);
    const popoverRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        if (!isOpen) return;

        const onPointerDown = (event: MouseEvent) => {
            if (!popoverRef.current) return;
            if (!popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const onEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };

        window.addEventListener("mousedown", onPointerDown);
        window.addEventListener("keydown", onEscape);
        return () => {
            window.removeEventListener("mousedown", onPointerDown);
            window.removeEventListener("keydown", onEscape);
        };
    }, [isOpen]);

    const applyImage = () => {
        const normalizedSrc = src.trim();
        if (!normalizedSrc) return;

        try {
            const parsedUrl = new URL(normalizedSrc.includes(":") ? normalizedSrc : `https://${normalizedSrc}`);
            if (!["http:", "https:"].includes(parsedUrl.protocol)) return;

            editor.chain().focus().setImage({ src: parsedUrl.toString(), alt: alt.trim() || undefined }).run();
            setIsOpen(false);
            setSrc("");
            setAlt("");
        } catch {
            return;
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            event.target.value = "";
            return;
        }

        setIsUploading(true);
        try {
            let imageSrc = "";

            if (onImageUpload) {
                const uploaded = await onImageUpload(file);
                imageSrc = uploaded.url;
            } else {
                imageSrc = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (typeof reader.result === "string") {
                            resolve(reader.result);
                        } else {
                            reject(new Error("Invalid file result"));
                        }
                    };
                    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
                    reader.readAsDataURL(file);
                });
            }

            editor.chain().focus().setImage({ src: imageSrc, alt: alt.trim() || file.name }).run();
            setIsOpen(false);
            setSrc("");
            setAlt("");
        } finally {
            setIsUploading(false);
            event.target.value = "";
        }
    };

    return (
        <div className="relative" ref={popoverRef}>
            <ToolbarButton
                onClick={() => setIsOpen((prev) => !prev)}
                title="Insert image"
            >
                <ImagePlus size={16} />
            </ToolbarButton>

            {isOpen && (
                <div className="absolute left-1/2 z-10 mt-2 w-72 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                    <label className="mb-1 block text-xs font-medium text-gray-600">Image URL</label>
                    <input
                        className="mb-2 w-full rounded border border-gray-300 px-2 py-1 text-sm"
                        value={src}
                        onChange={(e) => setSrc(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                    />
                    <label className="mb-1 block text-xs font-medium text-gray-600">Alt text</label>
                    <input
                        className="mb-3 w-full rounded border border-gray-300 px-2 py-1 text-sm"
                        value={alt}
                        onChange={(e) => setAlt(e.target.value)}
                        placeholder="Describe the image"
                    />
                    <label className="mb-1 block text-xs font-medium text-gray-600">Upload image</label>
                    <input
                        className="mb-3 block w-full text-sm text-gray-700 file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-3 file:py-1 file:text-sm file:hover:bg-gray-200"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                    />
                    <div className="flex gap-2">
                        <button type="button" className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200" onClick={() => setIsOpen(false)}>Cancel</button>
                        <button type="button" className="ml-auto rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50" onClick={applyImage} disabled={isUploading}>{isUploading ? "Uploading..." : "Insert"}</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImagePopover;
