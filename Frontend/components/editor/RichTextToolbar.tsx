'use client';

import { useEffect, useRef, useState } from 'react';

interface Position {
  top: number;
  left: number;
}

export function RichTextToolbar() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const toolbarRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();

      if (!selection || selection.isCollapsed || selection.toString().trim() === '') {
        const activeEl = document.activeElement;
        if (
          !toolbarRef.current ||
          (activeEl instanceof Node && !toolbarRef.current.contains(activeEl))
        ) {
          setVisible(false);
          setShowLinkInput(false);
        }
        return;
      }

      const anchorNode = selection.anchorNode;
      let el: Node | null = anchorNode;

      while (el) {
        if (el instanceof HTMLElement && el.contentEditable === 'true') {
          const range = selection.getRangeAt(0);
          savedRangeRef.current = range.cloneRange();
          const rect = range.getBoundingClientRect();
          const canvasEl = document.getElementById('resume-canvas-scroll');
          const canvasRect = canvasEl?.getBoundingClientRect() ?? {
            top: 0,
            left: 0,
          };

          setPosition({
            top: rect.top - canvasRect.top + (canvasEl?.scrollTop ?? 0) - 44,
            left: rect.left - canvasRect.left + rect.width / 2 - 80,
          });
          setVisible(true);
          return;
        }
        el = el.parentNode;
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const restoreSelection = () => {
    if (savedRangeRef.current) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedRangeRef.current);
    }
  };

  const execFormat = (command: string, value?: string) => {
    restoreSelection();
    document.execCommand(command, false, value);
  };

  const applyLink = () => {
    if (linkUrl.trim()) {
      const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
      execFormat('createLink', url);
      const selection = window.getSelection();
      const anchorEl = selection?.anchorNode?.parentElement?.closest('a');
      if (anchorEl) {
        anchorEl.setAttribute('target', '_blank');
        anchorEl.setAttribute('rel', 'noopener noreferrer');
      }
    }
    setShowLinkInput(false);
    setLinkUrl('');
    setVisible(false);
  };

  const isActive = (command: string) => {
    try {
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  };

  if (!visible) return null;

  return (
    <div
      ref={toolbarRef}
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${Math.max(0, position.left)}px`,
        zIndex: 1000,
        background: '#1e293b',
        borderRadius: '6px',
        padding: '4px 6px',
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        userSelect: 'none',
      }}
    >
      {[
        { cmd: 'bold', label: 'B', style: { fontWeight: 'bold' as const } },
        { cmd: 'italic', label: 'I', style: { fontStyle: 'italic' as const } },
        {
          cmd: 'underline',
          label: 'U',
          style: { textDecoration: 'underline' as const },
        },
      ].map(({ cmd, label, style }) => (
        <button
          key={cmd}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execFormat(cmd)}
          title={cmd.charAt(0).toUpperCase() + cmd.slice(1)}
          style={{
            width: '28px',
            height: '28px',
            border: 'none',
            borderRadius: '4px',
            background: isActive(cmd) ? '#3b82f6' : 'transparent',
            color: 'white',
            cursor: 'pointer',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...style,
          }}
        >
          {label}
        </button>
      ))}

      <div
        style={{ width: '0.5px', height: '18px', background: '#334155', margin: '0 2px' }}
      />

      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setShowLinkInput(!showLinkInput)}
        title="Add link"
        style={{
          width: '28px',
          height: '28px',
          border: 'none',
          borderRadius: '4px',
          background: showLinkInput ? '#3b82f6' : 'transparent',
          color: 'white',
          cursor: 'pointer',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Link
      </button>

      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => execFormat('unlink')}
        title="Remove link"
        style={{
          width: '28px',
          height: '28px',
          border: 'none',
          borderRadius: '4px',
          background: 'transparent',
          color: '#94a3b8',
          cursor: 'pointer',
          fontSize: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Un
      </button>

      {showLinkInput && (
        <div style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}>
          <input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyLink()}
            placeholder="https://..."
            autoFocus
            style={{
              width: '160px',
              height: '26px',
              borderRadius: '4px',
              border: 'none',
              padding: '0 8px',
              fontSize: '11px',
              outline: 'none',
              background: '#0f172a',
              color: 'white',
            }}
          />
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={applyLink}
            style={{
              height: '26px',
              padding: '0 8px',
              borderRadius: '4px',
              background: '#3b82f6',
              border: 'none',
              color: 'white',
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
