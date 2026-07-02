import React from "react";
import type { Editor } from "@tiptap/react";

import { Link as LinkIcon } from "lucide-react";
import { ToolbarButton } from "./toolbar";

interface LinkPopoverProps {
    editor: Editor;
}

type LinkTarget = "_blank" | "_self";

const DEFAULT_LINK_REL = "noopener noreferrer";

const isLinkTarget = (value: unknown): value is LinkTarget =>
    value === "_blank" || value === "_self";

const LinkPopover: React.FC<LinkPopoverProps> = ({ editor }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const popoverRef = React.useRef<HTMLDivElement | null>(null);
    const [href, setHref] = React.useState("");
    const [target, setTarget] = React.useState<LinkTarget>("_blank");
    const [rel, setRel] = React.useState(DEFAULT_LINK_REL);

    React.useEffect(() => {
        if (!isOpen) {
            return;
        }

        const onPointerDown = (event: MouseEvent) => {
            if (!popoverRef.current) {
                return;
            }

            if (!popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const onEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        window.addEventListener("mousedown", onPointerDown);
        window.addEventListener("keydown", onEscape);
        return () => {
            window.removeEventListener("mousedown", onPointerDown);
            window.removeEventListener("keydown", onEscape);
        };
    }, [isOpen]);

    const removeLink = () => {
        editor.chain().focus().unsetLink().run();
    };

    const applyLink = () => {
        const normalizedUrl = href.trim();
        const normalizedRel = rel.trim() || undefined;
        if (!normalizedUrl) return;

        try {
            const parsedUrl = new URL(normalizedUrl.includes(":") ? normalizedUrl : `https://${normalizedUrl}`);
            if (!["http:", "https:", "mailto:"].includes(parsedUrl.protocol)) return;

            editor.chain().focus().setLink({ href: parsedUrl.toString(), target, rel: normalizedRel }).run();
            setIsOpen(false);
        } catch {
            return;
        }
    };

    return (
        <div className="relative" ref={popoverRef}>
            <ToolbarButton
                onClick={() => {
                    const activeLink = editor.getAttributes("link");
                    setHref(typeof activeLink?.href === "string" ? activeLink.href : "");
                    setTarget(isLinkTarget(activeLink?.target) ? activeLink.target : "_blank");
                    setRel(typeof activeLink?.rel === "string" ? activeLink.rel : DEFAULT_LINK_REL);
                    setIsOpen((prev) => !prev);
                }}
                active={editor.isActive("link")}
                title="Link"
                ariaPressed={editor.isActive("link")}
            >
                <LinkIcon size={16} />
            </ToolbarButton>

            {isOpen && (
                <div className="absolute left-1/2 z-10 mt-2 w-72 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-3 text-gray-700 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">URL</label>
                    <input className="mb-2 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 placeholder-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500" value={href} onChange={(e) => setHref(e.target.value)} placeholder="https://example.com" />
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Target</label>
                    <select className="mb-2 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" value={target} onChange={(e) => setTarget(e.target.value as LinkTarget)}>
                        <option value="_blank">New Tab</option>
                        <option value="_self">Same Window</option>
                    </select>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Rel</label>
                    <input className="mb-3 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 placeholder-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500" value={rel} onChange={(e) => setRel(e.target.value)} placeholder={DEFAULT_LINK_REL} />
                    <div className="flex gap-2">
                        <button type="button" className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700" onClick={() => setIsOpen(false)}>Cancel</button>
                        {editor.isActive("link") && <button type="button" className="rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-950" onClick={() => { removeLink(); setIsOpen(false); }}>Unlink</button>}
                        <button type="button" className="ml-auto rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700" onClick={applyLink}>Apply</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LinkPopover;
