import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BulletListProps {
  text: string;
  className?: string;
  bulletClassName?: string;
  itemClassName?: string;
  maxItems?: number;
}

export function BulletList({ 
  text, 
  className = "", 
  bulletClassName = "", 
  itemClassName = "",
  maxItems 
}: BulletListProps) {
  if (!text) return null;

  // Split on newlines, trim whitespace, remove empty lines
  const lines = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  // If there's 0 or 1 line, just render as a normal paragraph
  if (lines.length <= 1) {
    return (
      <p className={`text-ink-soft font-sans leading-relaxed ${className}`}>
        {text}
      </p>
    );
  }

  const isTruncated = maxItems !== undefined && lines.length > maxItems;
  const visibleLines = isTruncated ? lines.slice(0, maxItems) : lines;
  const hiddenCount = lines.length - visibleLines.length;

  // Otherwise, render as a clean bullet list
  return (
    <div className={`space-y-2.5 ${className}`}>
      <ul className="space-y-2.5">
        {visibleLines.map((line, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <ChevronRight className={`w-4 h-4 mt-[3px] shrink-0 text-[#2E73C9] ${bulletClassName}`} />
            <span className={`text-ink-soft font-sans leading-snug flex-1 ${itemClassName}`}>
              {line}
            </span>
          </li>
        ))}
      </ul>
      {isTruncated && hiddenCount > 0 && (
        <div className="text-xs font-semibold text-ink-muted pl-7 pt-1">
          + {hiddenCount} more {hiddenCount === 1 ? 'item' : 'items'}
        </div>
      )}
    </div>
  );
}
