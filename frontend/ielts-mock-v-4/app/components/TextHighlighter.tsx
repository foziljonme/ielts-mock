import React, { useState, useRef } from 'react';
import { Highlighter, StickyNote, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { HighlightAnnotation } from '../types';

interface TextHighlighterProps {
  text: string;
  highlights: HighlightAnnotation[];
  onHighlight: (highlight: HighlightAnnotation) => void;
  onRemoveHighlight: (id: string) => void;
}

const HIGHLIGHT_COLORS = [
  { name: 'Yellow', value: '#fef08a' },
  { name: 'Green', value: '#bbf7d0' },
  { name: 'Blue', value: '#bfdbfe' },
  { name: 'Pink', value: '#fbcfe8' }
];

export function TextHighlighter({ text, highlights, onHighlight, onRemoveHighlight }: TextHighlighterProps) {
  const [selectedColor, setSelectedColor] = useState(HIGHLIGHT_COLORS[0].value);
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [note, setNote] = useState('');
  const textRef = useRef<HTMLDivElement>(null);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const selectedStr = selection.toString();
      const range = selection.getRangeAt(0);
      
      // Calculate start position
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(textRef.current!);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      const start = preSelectionRange.toString().length;
      
      setSelectedText(selectedStr);
      setSelectionRange({ start, end: start + selectedStr.length });
    }
  };

  const applyHighlight = () => {
    if (selectedText && selectionRange) {
      const highlight: HighlightAnnotation = {
        id: `highlight-${Date.now()}`,
        text: selectedText,
        color: selectedColor,
        note: note || undefined,
        position: selectionRange
      };
      onHighlight(highlight);
      setSelectedText('');
      setSelectionRange(null);
      setNote('');
      setShowNoteDialog(false);
      window.getSelection()?.removeAllRanges();
    }
  };

  const renderHighlightedText = () => {
    if (highlights.length === 0) {
      return <div className="whitespace-pre-wrap">{text}</div>;
    }

    // Sort highlights by position
    const sortedHighlights = [...highlights].sort((a, b) => a.position.start - b.position.start);
    
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedHighlights.forEach((highlight, idx) => {
      // Add text before highlight
      if (highlight.position.start > lastIndex) {
        parts.push(
          <span key={`text-${idx}`}>
            {text.substring(lastIndex, highlight.position.start)}
          </span>
        );
      }

      // Add highlighted text
      parts.push(
        <span
          key={highlight.id}
          style={{ backgroundColor: highlight.color }}
          className="relative cursor-pointer group px-0.5 rounded"
          title={highlight.note}
        >
          {text.substring(highlight.position.start, highlight.position.end)}
          {highlight.note && (
            <StickyNote className="inline w-3 h-3 ml-1 text-gray-600" />
          )}
          <button
            onClick={() => onRemoveHighlight(highlight.id)}
            className="absolute -top-5 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded shadow-md p-1"
          >
            <Trash2 className="w-3 h-3 text-red-500" />
          </button>
        </span>
      );

      lastIndex = highlight.position.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key="text-end">{text.substring(lastIndex)}</span>
      );
    }

    return <div className="whitespace-pre-wrap">{parts}</div>;
  };

  return (
    <div className="space-y-4">
      {/* Highlighter toolbar */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
        <Highlighter className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-600">Highlight color:</span>
        <div className="flex gap-2">
          {HIGHLIGHT_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => setSelectedColor(color.value)}
              className={`w-6 h-6 rounded border-2 ${
                selectedColor === color.value ? 'border-gray-800' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
        {selectedText && (
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowNoteDialog(true)}>
              Add Note
            </Button>
            <Button size="sm" onClick={applyHighlight}>
              Apply Highlight
            </Button>
          </div>
        )}
      </div>

      {/* Note dialog */}
      {showNoteDialog && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <label className="block text-sm mb-2">Add a note to your highlight:</label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter your note..."
            className="mb-2"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={applyHighlight}>
              Save & Highlight
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowNoteDialog(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Text content */}
      <div
        ref={textRef}
        onMouseUp={handleTextSelection}
        className="p-6 bg-white border rounded-lg select-text leading-relaxed"
      >
        {renderHighlightedText()}
      </div>
    </div>
  );
}
