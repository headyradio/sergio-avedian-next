import { Editor, Range } from '@tiptap/react';

export interface SlashCommand {
  title: string;
  description: string;
  icon: string;
  command: ({ editor, range }: { editor: Editor; range: Range }) => void;
}

export const slashCommands: SlashCommand[] = [
  {
    title: 'Bold',
    description: 'Make text bold',
    icon: '𝐁',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setMark('bold').run();
    },
  },
  {
    title: 'Italic',
    description: 'Make text italic',
    icon: '𝐼',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setMark('italic').run();
    },
  },
  {
    title: 'Heading',
    description: 'Section heading (H3)',
    icon: '📋',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run();
    },
  },
  {
    title: 'Bullet List',
    description: 'Create a bullet list',
    icon: '•',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: 'Numbered List',
    description: 'Create a numbered list',
    icon: '1.',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: 'Quote',
    description: 'Insert a blockquote',
    icon: '❝',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: 'Link',
    description: 'Add a link',
    icon: '🔗',
    command: ({ editor, range }) => {
      const url = window.prompt('Enter URL:');
      if (url) {
        editor.chain().focus().deleteRange(range).setLink({ href: url }).run();
      }
    },
  },
  {
    title: 'Code Block',
    description: 'Insert a code block',
    icon: '</>',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: 'Divider',
    description: 'Insert a horizontal rule',
    icon: '―',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
];
