import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { SlashCommand } from '@/lib/slash-commands';
import { cn } from '@/lib/utils';

export interface SlashCommandMenuProps {
  items: SlashCommand[];
  command: (item: SlashCommand) => void;
  editor?: any;
}

export interface SlashCommandMenuRef {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

const SlashCommandMenu = forwardRef<SlashCommandMenuRef, SlashCommandMenuProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    const selectItem = (index: number) => {
      const item = items[index];
      if (item) {
        command(item);
      }
    };

    const upHandler = () => {
      setSelectedIndex((selectedIndex + items.length - 1) % items.length);
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useImperativeHandle(ref, () => ({
      onKeyDown: (event: KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
          upHandler();
          return true;
        }

        if (event.key === 'ArrowDown') {
          downHandler();
          return true;
        }

        if (event.key === 'Enter') {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    if (items.length === 0) {
      return null;
    }

    return (
      <div className="z-50 min-w-[250px] overflow-hidden rounded-lg border border-border bg-popover shadow-lg animate-in fade-in-50 slide-in-from-top-2">
        <div className="max-h-[300px] overflow-y-auto p-1">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => selectItem(index)}
              className={cn(
                'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors',
                index === selectedIndex
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <div className="flex flex-col">
                <span className="font-medium">{item.title}</span>
                <span className="text-xs opacity-70">{item.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }
);

SlashCommandMenu.displayName = 'SlashCommandMenu';

export default SlashCommandMenu;
