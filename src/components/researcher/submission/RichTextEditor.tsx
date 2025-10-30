// components/submission/RichTextEditor.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Bold, Italic, Underline, List as ListIcon, ListOrdered,
  Image as ImageIcon, Table as TableIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Indent, Outdent, Plus, Minus
} from 'lucide-react';

interface RichTextEditorProps {
  label: string | React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  maxWords?: number;
  required?: boolean;
  placeholder?: string;
  hideImageUpload?: boolean; // NEW: allow hiding image upload button
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  helperText,
  maxWords = 0,
  required = false,
  placeholder = '',
  hideImageUpload = false, // default: show image upload unless explicitly hidden
}) => {
  const [wordCount, setWordCount] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(2);
  const [tableCols, setTableCols] = useState(2);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isUpdatingRef = useRef(false);
  const savedRangeRef = useRef<Range | null>(null);

  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
        setWordCount(countWords(value || ''));
      }
    }
  }, [value]);

  useEffect(() => {
    const onSelectionChange = () => {
      const el = editorRef.current;
      const sel = window.getSelection();
      if (!el || !sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      const anchorNode = sel.anchorNode;
      if (anchorNode && el.contains(anchorNode)) {
        savedRangeRef.current = range.cloneRange();
      }
    };
    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  }, []);

  const countWords = (text: string | null | undefined) => {
    if (!text) return 0;
    const cleaned = text.replace(/<[^>]*>/g, '').trim();
    if (!cleaned) return 0;
    const words = cleaned.split(/\s+/).filter(word => word.length >= 2);
    return words.length;
  };

  const handleTextChange = () => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      const content = editorRef.current.innerHTML;
      onChange(content);
      setWordCount(countWords(content));
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  };

// Add this helper above handleBlur (e.g., place it after deleteColumnFromTable)
const normalizeLists = () => {
  const root = editorRef.current;
  if (!root) return;
  // Unwrap stray DIVs inside LI and ensure LI renders as list-item
  root.querySelectorAll('li').forEach(li => {
    li.querySelectorAll('div').forEach(div => {
      while (div.firstChild) li.insertBefore(div.firstChild, div);
      div.remove();
    });
    (li as HTMLElement).style.display = 'list-item';
  });
  root.normalize();
};


  const handleBlur = () => {
    normalizeLists();
    forceListStylesInline();
    handleTextChange();
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    editorRef.current?.normalize();
    handleTextChange();
  };

  const ensureBlock = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    let container = range.commonAncestorContainer as Node;
    if (container.nodeType === Node.TEXT_NODE) container = (container as Text).parentElement as Node;
    const el = container as HTMLElement | null;
    if (!editorRef.current || !el) return;

    const blockTags = ['P', 'DIV', 'LI', 'UL', 'OL', 'TABLE', 'H1','H2','H3','H4','H5','H6'];
    const closest = el.closest?.(blockTags.map(t => t.toLowerCase()).join(','));
    const isInsideBlock = blockTags.includes(el.tagName) || !!closest;

    if (!isInsideBlock) {
      const p = document.createElement('p');
      p.appendChild(document.createElement('br'));
      range.insertNode(p);
      const newRange = document.createRange();
      newRange.setStart(p, 0);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
    }
  };

  const applyList = (type: 'ul' | 'ol') => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    ensureBlock();
    removeListHidingClasses();
    const cmd = type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList';
    document.execCommand(cmd, false, undefined);
    forceListStylesInline();
    editorRef.current.normalize();
    handleTextChange();
  };

  const removeListHidingClasses = () => {
    const root = editorRef.current;
    if (!root) return;
    root.querySelectorAll('ul,ol').forEach(list => {
      list.classList.remove('list-none', 'prose', 'prose-sm', 'prose-base', 'prose-lg');
      let parent: HTMLElement | null = list.parentElement;
      while (parent && parent !== root) {
        parent.classList.remove('list-none', 'prose', 'prose-sm', 'prose-base', 'prose-lg');
        parent = parent.parentElement;
      }
    });
  };

  const forceListStylesInline = () => {
    const root = editorRef.current;
    if (!root) return;
    root.querySelectorAll('ul').forEach(ul => {
      ul.style.listStyleType = 'disc';
      ul.style.listStylePosition = 'inside';
      ul.style.paddingLeft = '1.25rem';
      ul.style.margin = '0.5rem 0';
    });
    root.querySelectorAll('ol').forEach(ol => {
      ol.style.listStyleType = 'decimal';
      ol.style.listStylePosition = 'inside';
      ol.style.paddingLeft = '1.25rem';
      ol.style.margin = '0.5rem 0';
    });
    root.querySelectorAll('li').forEach(li => {
      li.style.display = 'list-item';
      li.style.margin = '0.25rem 0';
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = `<img src="${event.target?.result}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px;" />`;
          if (editorRef.current) {
            editorRef.current.focus();
            document.execCommand('insertHTML', false, img);
            setTimeout(() => {
              handleTextChange();
            }, 100);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const openTableModal = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
    setShowTableModal(true);
  };

  const insertTable = () => {
    if (!editorRef.current) return;

    const markerId = `rte-marker-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const rows = Array.from({ length: tableRows });
    const cols = Array.from({ length: tableCols });

    const tableHTML = `
      <table class="rte-table" style="border-collapse: collapse; width: 100%; margin: 10px 0; table-layout: fixed;">
        ${rows.map((_, i) => `
          <tr>
            ${cols.map((__, j) =>
              `<td contenteditable="true" style="padding:8px;border:1px solid #ddd;min-width:80px;word-wrap:break-word;">Cell ${i + 1}-${j + 1}</td>`
            ).join('')}
          </tr>
        `).join('')}
      </table>
      <span id="${markerId}"><br></span>
    `;

    editorRef.current.focus();
    const sel = window.getSelection();
    sel?.removeAllRanges();
    if (savedRangeRef.current) sel?.addRange(savedRangeRef.current);

    document.execCommand('insertHTML', false, tableHTML);

    const marker = editorRef.current.querySelector(`#${markerId}`);
    if (marker) {
      const range = document.createRange();
      range.setStartAfter(marker);
      range.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(range);
      marker.parentElement?.removeChild(marker);
    }

    setTimeout(() => {
      handleTextChange();
      editorRef.current?.focus();
    }, 100);

    setShowTableModal(false);
    setTableRows(2);
    setTableCols(2);
  };

  const findEnclosingTable = (): HTMLTableElement | null => {
    const selection = window.getSelection();
    if (!selection) return null;
    let node = selection.anchorNode as Node | null;
    if (!node) return null;
    if (node.nodeType === Node.TEXT_NODE) node = (node as Text).parentElement;
    let element = node as HTMLElement | null;
    while (element && editorRef.current && element !== editorRef.current) {
      if (element.tagName === 'TABLE') return element as HTMLTableElement;
      element = element.parentElement;
    }
    return null;
  };

  const addRowToTable = () => {
    const table = findEnclosingTable();
    if (!table) return alert('Please click inside a table to add a row');
    const row = table.insertRow();
    const colCount = table.rows[0].cells.length;
    for (let i = 0; i < colCount; i++) {
      const cell = row.insertCell();
      cell.contentEditable = 'true';
      cell.style.padding = '8px';
      cell.style.border = '1px solid #ddd';
      cell.style.minWidth = '100px';
      cell.textContent = 'New Cell';
    }
    handleTextChange();
  };

  const addColumnToTable = () => {
    const table = findEnclosingTable();
    if (!table) return alert('Please click inside a table to add a column');
    for (let i = 0; i < table.rows.length; i++) {
      const cell = table.rows[i].insertCell();
      cell.contentEditable = 'true';
      cell.style.padding = '8px';
      cell.style.border = '1px solid #ddd';
      cell.style.minWidth = '100px';
      cell.textContent = 'New Cell';
    }
    handleTextChange();
  };

  const deleteRowFromTable = () => {
    const selection = window.getSelection();
    if (!selection) return alert('Please click inside a table row to delete it');
    let node = selection.anchorNode as Node | null;
    if (!node) return alert('Please click inside a table row to delete it');
    if (node.nodeType === Node.TEXT_NODE) node = (node as Text).parentElement;
    const element = node as HTMLElement | null;
    if (!element) return alert('Please click inside a table row to delete it');

    const tr = element.closest('tr');
    if (!tr) return alert('Please click inside a table row to delete it');

    const table = tr.closest('table') as HTMLTableElement | null;
    if (!table) return alert('Please click inside a table row to delete it');

    if (table.rows.length <= 1) return alert('Cannot delete the last row');

    tr.remove();
    handleTextChange();
  };

  const deleteColumnFromTable = () => {
    const selection = window.getSelection();
    if (!selection) return alert('Please click inside a table cell to delete the column');
    let node = selection.anchorNode as Node | null;
    if (!node) return alert('Please click inside a table cell to delete the column');
    if (node.nodeType === Node.TEXT_NODE) node = (node as Text).parentElement;
    const element = node as HTMLElement | null;
    if (!element) return alert('Please click inside a table cell to delete the column');

    const cell = element.closest('td,th') as HTMLTableCellElement | null;
    if (!cell) return alert('Please click inside a table cell to delete the column');

    const table = cell.closest('table') as HTMLTableElement | null;
    if (!table) return alert('Please click inside a table cell to delete the column');

    const cellIndex = cell.cellIndex;
    if (table.rows[0].cells.length <= 1) return alert('Cannot delete the last column');

    for (let i = 0; i < table.rows.length; i++) {
      table.rows[i].deleteCell(cellIndex);
    }
    handleTextChange();
  };

  return (
    <div className="space-y-3 relative">
      <style jsx>{`
        .rte ul { list-style: disc !important; list-style-position: inside !important; margin: 0.5rem 0 !important; padding-left: 1.25rem !important; }
        .rte ol { list-style: decimal !important; list-style-position: inside !important; margin: 0.5rem 0 !important; padding-left: 1.25rem !important; }
        .rte li { display: list-item !important; margin: 0.25rem 0 !important; }
        .rte .list-none { list-style: disc !important; }
        .rte-table td, .rte-table th { border: 1px solid #ddd; padding: 8px; }
        .rte-table { border-collapse: collapse; width: 100%; table-layout: fixed; }
        .editor-with-placeholder:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
      `}</style>

      {/* Label */}
      <label className="block text-sm font-semibold text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {/* Helper Text */}
      {helperText && (
        <p className="text-xs text-[#64748B]" style={{ fontFamily: 'Metropolis, sans-serif', whiteSpace: 'pre-line' }}>
          {helperText}
        </p>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-white border-2 border-gray-300 rounded-t-lg">
        <button type="button" onClick={() => applyFormat('bold')} className="p-2 hover:bg-blue-100 rounded transition-colors text-[#1E293B] hover:text-[#3B82F6]" title="Bold">
          <Bold size={20} strokeWidth={2.5} />
        </button>
        <button type="button" onClick={() => applyFormat('italic')} className="p-2 hover:bg-blue-100 rounded transition-colors text-[#1E293B] hover:text-[#3B82F6]" title="Italic">
          <Italic size={20} strokeWidth={2.5} />
        </button>
        <button type="button" onClick={() => applyFormat('underline')} className="p-2 hover:bg-blue-100 rounded transition-colors text-[#1E293B] hover:text-[#3B82F6]" title="Underline">
          <Underline size={20} strokeWidth={2.5} />
        </button>

        <div className="w-px h-6 bg-gray-400 mx-1" />

        <button type="button" onClick={() => applyList('ul')} className="p-2 hover:bg-blue-100 rounded transition-colors text-[#1E293B] hover:text-[#3B82F6]" title="Bullet List">
          <ListIcon size={20} strokeWidth={2.5} />
        </button>
        <button type="button" onClick={() => applyList('ol')} className="p-2 hover:bg-blue-100 rounded transition-colors text-[#1E293B] hover:text-[#3B82F6]" title="Numbered List">
          <ListOrdered size={20} strokeWidth={2.5} />
        </button>

        <div className="w-px h-6 bg-gray-400 mx-1" />

        <button type="button" onClick={() => applyFormat('justifyLeft')} className="p-2 hover:bg-blue-100 rounded transition-colors text-[#1E293B] hover:text-[#3B82F6]" title="Align Left">
          <AlignLeft size={20} strokeWidth={2.5} />
        </button>
        <button type="button" onClick={() => applyFormat('justifyCenter')} className="p-2 hover:bg-blue-100 rounded transition-colors text-[#1E293B] hover:text-[#3B82F6]" title="Align Center">
          <AlignCenter size={20} strokeWidth={2.5} />
        </button>
        <button type="button" onClick={() => applyFormat('justifyRight')} className="p-2 hover:bg-blue-100 rounded transition-colors text-[#1E293B] hover:text-[#3B82F6]" title="Align Right">
          <AlignRight size={20} strokeWidth={2.5} />
        </button>
        <button type="button" onClick={() => applyFormat('justifyFull')} className="p-2 hover:bg-blue-100 rounded transition-colors text-[#1E293B] hover:text-[#3B82F6]" title="Justify">
          <AlignJustify size={20} strokeWidth={2.5} />
        </button>

        <div className="w-px h-6 bg-gray-400 mx-1" />

        <button type="button" onClick={() => applyFormat('indent')} className="p-2 hover:bg-blue-100 rounded transition-colors text-[#1E293B] hover:text-[#3B82F6]" title="Increase Indent">
          <Indent size={20} strokeWidth={2.5} />
        </button>
        <button type="button" onClick={() => applyFormat('outdent')} className="p-2 hover:bg-blue-100 rounded transition-colors text-[#1E293B] hover:text-[#3B82F6]" title="Decrease Indent">
          <Outdent size={20} strokeWidth={2.5} />
        </button>

        <div className="w-px h-6 bg-gray-400 mx-1" />

        <button type="button" onClick={openTableModal} className="p-2 hover:bg-yellow-100 rounded transition-colors text-[#1E293B] hover:text-[#F59E0B]" title="Insert Table">
          <TableIcon size={20} strokeWidth={2.5} />
        </button>
        <button type="button" onClick={addRowToTable} className="p-2 hover:bg-green-100 rounded transition-colors text-[#1E293B] hover:text-green-600" title="Add Row">
          <Plus size={20} strokeWidth={2.5} />
        </button>
        <button type="button" onClick={addColumnToTable} className="p-2 hover:bg-green-100 rounded transition-colors text-[#1E293B] hover:text-green-600" title="Add Column">
          <Plus size={20} strokeWidth={2.5} className="rotate-90" />
        </button>
        <button type="button" onClick={deleteRowFromTable} className="p-2 hover:bg-red-100 rounded transition-colors text-[#1E293B] hover:text-red-600" title="Delete Row">
          <Minus size={20} strokeWidth={2.5} />
        </button>
        <button type="button" onClick={deleteColumnFromTable} className="p-2 hover:bg-red-100 rounded transition-colors text-[#1E293B] hover:text-red-600" title="Delete Column">
          <Minus size={20} strokeWidth={2.5} className="rotate-90" />
        </button>

        <div className="w-px h-6 bg-gray-400 mx-1" />

        {!hideImageUpload && (
          <>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-yellow-100 rounded transition-colors text-[#1E293B] hover:text-[#F59E0B]" title="Upload Image">
              <ImageIcon size={20} strokeWidth={2.5} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
          </>
        )}
      </div>

      {/* Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          className="rte editor-with-placeholder w-full h-[400px] p-4 border-2 border-gray-300 rounded-b-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B] bg-white overflow-auto"
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder || ''}
          onInput={handleTextChange}
          onBlur={handleBlur}
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        />
      </div>

      {/* Word count */}
      <div className="flex justify-between items-center text-xs" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        <span className="text-[#64748B]">
          Word count: <span className="font-semibold text-[#1E293B]">{wordCount}</span> {wordCount === 1 ? 'word' : 'words'}
        </span>
      </div>

      {/* Table Modal */}
      {showTableModal && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          onClick={() => setShowTableModal(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-white rounded-lg p-6 w-96 max-w-[min(24rem,90%)] shadow-xl"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.preventDefault()}
          >
            <h3 className="text-lg font-bold text-[#1E293B] mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Insert Table
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Rows
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value || '2', 10))}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B] font-semibold"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Columns
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value || '2', 10))}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B] font-semibold"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={insertTable}
                className="flex-1 px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] font-semibold"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Insert
              </button>
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-[#1E293B] rounded-lg hover:bg-gray-300 font-semibold"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
