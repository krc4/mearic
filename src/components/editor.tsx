
'use client';

import { useEditor, EditorContent, type Editor as EditorType } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Minus,
  WrapText,
  Heading1,
  Heading2,
  Heading3,
  Table,
  Square,
  ArrowUpToLine,
  ArrowDownToLine,
  ArrowLeftToLine,
  ArrowRightToLine,
  Trash2,
  Combine,
  Split,
  Rows,
  Columns
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { useEffect } from 'react';
import TableKit from '@tiptap/extension-table';


const Toolbar = ({ editor }: { editor: EditorType | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border border-input rounded-t-md p-1 flex flex-wrap items-center gap-1">
      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 1 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 2 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 3 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('strike')}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
       <Toggle
        size="sm"
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
       <Toggle
        size="sm"
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('blockquote')}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </Toggle>
       <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="h-4 w-4" />
      </Toggle>
      <span className="border-l border-input h-6 mx-1"></span>
        <Toggle
            size="sm"
            onPressedChange={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        >
            <Table className="h-4 w-4" />
        </Toggle>
        {editor.can().deleteTable() && (
            <>
                <Toggle
                    size="sm"
                    onPressedChange={() => editor.chain().focus().addColumnBefore().run()}
                >
                    <ArrowLeftToLine className="h-4 w-4" title="Sola sütun ekle" />
                </Toggle>
                 <Toggle
                    size="sm"
                    onPressedChange={() => editor.chain().focus().addColumnAfter().run()}
                >
                    <ArrowRightToLine className="h-4 w-4" title="Sağa sütun ekle" />
                </Toggle>
                 <Toggle
                    size="sm"
                    onPressedChange={() => editor.chain().focus().deleteColumn().run()}
                >
                    <Columns className="h-4 w-4" title="Sütunu sil"/>
                </Toggle>
                 <Toggle
                    size="sm"
                    onPressedChange={() => editor.chain().focus().addRowBefore().run()}
                >
                    <ArrowUpToLine className="h-4 w-4" title="Yukarı satır ekle"/>
                </Toggle>
                 <Toggle
                    size="sm"
                    onPressedChange={() => editor.chain().focus().addRowAfter().run()}
                >
                    <ArrowDownToLine className="h-4 w-4" title="Aşağıya satır ekle"/>
                </Toggle>
                 <Toggle
                    size="sm"
                    onPressedChange={() => editor.chain().focus().deleteRow().run()}
                >
                    <Rows className="h-4 w-4" title="Satırı sil"/>
                </Toggle>
                <Toggle
                    size="sm"
                    onPressedChange={() => editor.chain().focus().mergeOrSplit().run()}
                >
                    <Combine className="h-4 w-4" title="Hücreleri birleştir/ayır"/>
                </Toggle>
                <Toggle
                    size="sm"
                    onPressedChange={() => editor.chain().focus().toggleHeaderCell().run()}
                >
                    <Square className="h-4 w-4" title="Başlık hücresi yap"/>
                </Toggle>
                 <Toggle
                    size="sm"
                    onPressedChange={() => editor.chain().focus().deleteTable().run()}
                >
                    <Trash2 className="h-4 w-4 text-destructive" title="Tabloyu sil" />
                </Toggle>
            </>
        )}
    </div>
  );
};

interface EditorProps {
  initialContent?: string;
  onUpdate: (html: string) => void;
}

export const Editor = ({ initialContent = '', onUpdate }: EditorProps) => {
  const editor = useEditor({
    extensions: [
        StarterKit.configure({
            heading: {
                levels: [1, 2, 3],
            }
        }),
        TableKit.configure({
            resizable: true,
            // You can add more table configuration here
        }),
    ],
    content: initialContent,
    editorProps: {
        attributes: {
            class: "prose dark:prose-invert min-h-[400px] w-full max-w-none rounded-b-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        }
    },
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
        editor.commands.setContent(initialContent, false); // `false` prevents the `onUpdate` callback from firing unnecessarily
    }
  }, [initialContent, editor]);

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
