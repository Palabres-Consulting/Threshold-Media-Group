"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CharacterCount from "@tiptap/extension-character-count";
import { useEffect, useState, useRef } from "react";
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, CheckSquare, Quote, Minus, 
  Link as LinkIcon, Unlink, Undo, Redo,
  Table as TableIcon, PlusSquare, Trash2, AlertTriangle,
  Image as ImageIcon, X
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

// ----------------------------------------------------
// Custom Styled URL / Image Input Modal
// ----------------------------------------------------
interface UrlModalProps {
  isOpen: boolean;
  title: string;
  placeholder?: string;
  defaultValue?: string;
  onClose: () => void;
  onSubmit: (url: string) => void;
}

function UrlInputModal({ isOpen, title, placeholder, defaultValue = "", onClose, onSubmit }: UrlModalProps) {
  const [url, setUrl] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUrl(defaultValue);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, defaultValue]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(url.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4"
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-gray-800">
          <h3 className="text-sm font-bold text-gray-200">{title}</h3>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={placeholder || "https://example.com"}
            className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[var(--accent-main)] focus:ring-1 focus:ring-[var(--accent-main)] transition-all"
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-accent-main text-white hover:opacity-90 transition-opacity"
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Menu Toolbar Component
// ----------------------------------------------------
const MenuBar = ({ 
  editor, 
  onOpenLinkModal, 
  onOpenImageModal 
}: { 
  editor: any; 
  onOpenLinkModal: () => void; 
  onOpenImageModal: () => void;
}) => {
  if (!editor) return null;

  const ToolbarButton = ({ 
    onClick, isActive = false, disabled = false, title, children 
  }: { 
    onClick: () => void, isActive?: boolean, disabled?: boolean, title?: string, children: React.ReactNode 
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 md:p-2 rounded transition-colors ${
        isActive 
          ? 'text-[var(--accent-main)] bg-gray-800' 
          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
      } ${disabled ? 'opacity-20 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-6 bg-gray-800 mx-1" />;

  const getCurrentHeadingValue = () => {
    if (editor.isActive('heading', { level: 1 })) return 'h1';
    if (editor.isActive('heading', { level: 2 })) return 'h2';
    if (editor.isActive('heading', { level: 3 })) return 'h3';
    if (editor.isActive('heading', { level: 4 })) return 'h4';
    return 'p';
  };

  const handleHeadingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'p') {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = parseInt(value.replace('h', '')) as 1 | 2 | 3 | 4;
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 bg-gray-900 border-b border-gray-800 rounded-t-xl sticky top-0 z-10">
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
        <Undo size={16} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
        <Redo size={16} />
      </ToolbarButton>

      <Divider />

      <select 
        value={getCurrentHeadingValue()} 
        onChange={handleHeadingChange}
        className="bg-gray-800 text-gray-300 text-xs font-medium rounded px-2.5 py-1.5 border border-gray-700 focus:outline-none focus:border-[var(--accent-main)] cursor-pointer mr-1"
      >
        <option value="p">Paragraph</option>
        <option value="h1">Heading 1 (Large)</option>
        <option value="h2">Heading 2 (Medium)</option>
        <option value="h3">Heading 3 (Small)</option>
        <option value="h4">Heading 4 (Sub)</option>
      </select>

      <Divider />

      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
        <Italic size={16} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
        <UnderlineIcon size={16} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
        <Strikethrough size={16} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} title="Inline Code">
        <Code size={16} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
        <AlignLeft size={16} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
        <AlignCenter size={16} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
        <AlignRight size={16} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Justify">
        <AlignJustify size={16} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numbered List">
        <ListOrdered size={16} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} title="Checklist">
        <CheckSquare size={16} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote Asset">
        <Quote size={16} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Divider Line">
        <Minus size={16} />
      </ToolbarButton>

      <Divider />

      {/* Modern Link & Image Actions */}
      <ToolbarButton onClick={onOpenLinkModal} isActive={editor.isActive('link')} title="Hyperlink selection">
        <LinkIcon size={16} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')} title="Strip hyperlink">
        <Unlink size={16} />
      </ToolbarButton>
      <ToolbarButton onClick={onOpenImageModal} title="Insert Inline Image">
        <ImageIcon size={16} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton 
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} 
        title="Insert Layout Table"
      >
        <TableIcon size={16} />
      </ToolbarButton>
      
      {editor.isActive('table') && (
        <>
          <ToolbarButton onClick={() => editor.chain().focus().addColumnAfter().run()} title="Add Column Right">
            <span className="flex items-center text-[10px] font-bold gap-0.5"><PlusSquare size={12} />Col</span>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().addRowAfter().run()} title="Add Row Below">
            <span className="flex items-center text-[10px] font-bold gap-0.5"><PlusSquare size={12} />Row</span>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().deleteTable().run()} title="Delete Entire Table">
            <Trash2 size={14} className="text-red-400" />
          </ToolbarButton>
        </>
      )}
    </div>
  );
};

// ----------------------------------------------------
// Main Editor Component
// ----------------------------------------------------
export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    placeholder: string;
    defaultValue: string;
    onSubmit: (url: string) => void;
  }>({
    isOpen: false,
    title: "",
    placeholder: "",
    defaultValue: "",
    onSubmit: () => {},
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto my-4 border border-gray-800 shadow-md block mx-auto',
        },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      CharacterCount,
      Markdown, 
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: 'text-[var(--accent-main)] underline hover:opacity-80 transition-opacity cursor-pointer',
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm sm:prose-base max-w-none focus:outline-none p-4 md:p-6 min-h-[500px]',
      },
    },
    onUpdate: ({ editor }) => {
      const markdownStorage = editor.storage as any;
      onChange(markdownStorage.markdown.getMarkdown());
    },
  });

  useEffect(() => {
    if (editor) {
      const currentMarkdown = (editor.storage as any).markdown?.getMarkdown();
      if (content !== currentMarkdown) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  // Modal Handlers
  const handleOpenLinkModal = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href || "";
    setModalConfig({
      isOpen: true,
      title: "Insert / Edit Link",
      placeholder: "https://example.com",
      defaultValue: previousUrl,
      onSubmit: (url: string) => {
        if (!url) {
          editor.chain().focus().extendMarkRange('link').unsetLink().run();
          return;
        }
        const fixedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
        editor.chain().focus().extendMarkRange('link').setLink({ href: fixedUrl }).run();
      },
    });
  };

  const handleOpenImageModal = () => {
    if (!editor) return;
    setModalConfig({
      isOpen: true,
      title: "Insert Image URL",
      placeholder: "https://your-bucket.supabase.co/storage/v1/object/public/...",
      defaultValue: "",
      onSubmit: (url: string) => {
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      },
    });
  };

  const characterCount = editor?.storage.characterCount.characters() || 0;
  const wordCount = editor?.storage.characterCount.words() || 0;
  const standardGmailLimit = 45000;

  return (
    <div className="flex-1 flex flex-col bg-gray-900/30 rounded-xl border border-gray-800 shadow-inner overflow-hidden relative">
      <MenuBar 
        editor={editor} 
        onOpenLinkModal={handleOpenLinkModal}
        onOpenImageModal={handleOpenImageModal}
      />

      <UrlInputModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        placeholder={modalConfig.placeholder}
        defaultValue={modalConfig.defaultValue}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onSubmit={modalConfig.onSubmit}
      />
      
      <div className="overflow-y-auto max-h-[70vh] custom-scrollbar">
        <EditorContent editor={editor} />
      </div>

      <div className="flex items-center justify-between border-t border-gray-800 px-4 py-2 bg-gray-950 text-xs text-gray-500">
        <div className="flex gap-4">
          <span>{wordCount.toLocaleString()} words</span>
          <span>{characterCount.toLocaleString()} characters</span>
        </div>

        {characterCount > standardGmailLimit && (
          <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 animate-pulse">
            <AlertTriangle size={12} />
            <span>Approaching Gmail truncation size</span>
          </div>
        )}
      </div>
    </div>
  );
}