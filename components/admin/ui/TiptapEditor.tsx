"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { marked } from "marked";
import { useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Table as TableIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Code2,
  Undo2,
  Redo2,
  RowsIcon,
  Columns,
  Trash2,
} from "lucide-react";

const HTML_SIGNAL = /<\s*(h[1-6]|p|ul|ol|table|blockquote|div|section|article|pre)\b/i;

function toHtml(content: string): string {
  if (!content) return "";
  if (HTML_SIGNAL.test(content)) return content;
  return marked.parse(content, { async: false }) as string;
}

const PROSE_CLASSES = [
  "nivelics-prose prose prose-invert max-w-none",
  "prose-headings:font-medium prose-headings:text-white/90",
  "prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3",
  "prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-2",
  "prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2",
  "prose-p:text-white/70",
  "prose-a:text-[var(--primary)]",
  "prose-strong:text-white/90",
  "prose-ul:text-white/70 prose-ol:text-white/70",
  "prose-li:marker:text-white/40",
  "prose-blockquote:border-l-[var(--primary)] prose-blockquote:text-white/60",
  "prose-code:text-[var(--primary)] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded",
  "prose-pre:bg-white/[0.03] prose-pre:border prose-pre:border-white/10",
].join(" ");

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export function TiptapEditor({ value, onChange, placeholder, ariaLabel }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener" } }),
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder: placeholder ?? "Escribe el contenido…" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({ resizable: false, HTMLAttributes: { class: "tiptap-table" } }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: toHtml(value),
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `${PROSE_CLASSES} focus:outline-none min-h-[400px] px-4 py-4`,
        ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
      },
    },
  });

  // Sync external changes (e.g., auto-translate button fills contentEn)
  useEffect(() => {
    if (!editor) return;
    const incoming = toHtml(value);
    if (incoming !== editor.getHTML()) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor)
    return <div className="min-h-[460px] rounded-lg border border-border bg-bg-elevated" />;

  return (
    <div className="tiptap-editor rounded-lg border border-border bg-bg-elevated overflow-hidden">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const inTable = editor.isActive("table");

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-white/10 bg-white/[0.02] p-2 backdrop-blur-sm">
      <Group>
        <TBtn
          label="Negrita (Cmd+B)"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </TBtn>
        <TBtn
          label="Cursiva (Cmd+I)"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </TBtn>
        <TBtn
          label="Subrayado"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </TBtn>
        <TBtn
          label="Tachado"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </TBtn>
      </Group>

      <Sep />

      <Group>
        <TBtn
          label="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </TBtn>
        <TBtn
          label="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-4 w-4" />
        </TBtn>
        <TBtn
          label="Heading 4"
          active={editor.isActive("heading", { level: 4 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        >
          <Heading4 className="h-4 w-4" />
        </TBtn>
      </Group>

      <Sep />

      <Group>
        <TBtn
          label="Lista"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </TBtn>
        <TBtn
          label="Lista numerada"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </TBtn>
        <TBtn
          label="Cita"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </TBtn>
      </Group>

      <Sep />

      <Group>
        <TBtn
          label="Insertar tabla 3×3"
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        >
          <TableIcon className="h-4 w-4" />
        </TBtn>
        <LinkButton editor={editor} />
        <ImageButton editor={editor} />
        <TBtn
          label="Línea horizontal"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="h-4 w-4" />
        </TBtn>
        <TBtn
          label="Bloque de código"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 className="h-4 w-4" />
        </TBtn>
      </Group>

      {inTable && (
        <>
          <Sep />
          <Group>
            <TBtn
              label="Añadir fila arriba"
              onClick={() => editor.chain().focus().addRowBefore().run()}
            >
              <RowsIcon className="h-4 w-4 -scale-y-100" />
            </TBtn>
            <TBtn
              label="Añadir fila abajo"
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              <RowsIcon className="h-4 w-4" />
            </TBtn>
            <TBtn label="Eliminar fila" onClick={() => editor.chain().focus().deleteRow().run()}>
              <RowsIcon className="h-4 w-4 text-red-400" />
            </TBtn>
            <TBtn
              label="Añadir columna izquierda"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
            >
              <Columns className="h-4 w-4 -scale-x-100" />
            </TBtn>
            <TBtn
              label="Añadir columna derecha"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              <Columns className="h-4 w-4" />
            </TBtn>
            <TBtn
              label="Eliminar columna"
              onClick={() => editor.chain().focus().deleteColumn().run()}
            >
              <Columns className="h-4 w-4 text-red-400" />
            </TBtn>
            <TBtn label="Eliminar tabla" onClick={() => editor.chain().focus().deleteTable().run()}>
              <Trash2 className="h-4 w-4 text-red-400" />
            </TBtn>
          </Group>
        </>
      )}

      <Sep />

      <Group>
        <TBtn
          label="Deshacer (Cmd+Z)"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="h-4 w-4" />
        </TBtn>
        <TBtn
          label="Rehacer"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="h-4 w-4" />
        </TBtn>
      </Group>
    </div>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function Sep() {
  return <span className="mx-1 h-5 w-px bg-white/10" aria-hidden="true" />;
}

interface TBtnProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function TBtn({ label, active, disabled, onClick, children }: TBtnProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={[
        "p-1.5 rounded transition-colors",
        active
          ? "bg-white/10 text-[var(--primary)]"
          : "text-text-70 hover:bg-white/10 hover:text-text-100",
        disabled ? "opacity-40 cursor-not-allowed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}

function LinkButton({ editor }: { editor: Editor }) {
  const handle = useCallback(() => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL (vacío para quitar link):", prev ?? "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }, [editor]);
  return (
    <TBtn label="Link" active={editor.isActive("link")} onClick={handle}>
      <LinkIcon className="h-4 w-4" />
    </TBtn>
  );
}

function ImageButton({ editor }: { editor: Editor }) {
  const handle = useCallback(() => {
    const url = window.prompt("URL de la imagen:");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);
  return (
    <TBtn label="Imagen" onClick={handle}>
      <ImageIcon className="h-4 w-4" />
    </TBtn>
  );
}
