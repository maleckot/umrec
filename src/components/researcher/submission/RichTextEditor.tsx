'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
  hideImageUpload?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  helperText,
  maxWords = 0,
  required = false,
  placeholder = '',
  hideImageUpload = false,
}) => {
  const [wordCount, setWordCount] = useState(0);
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(2);
  const [tableCols, setTableCols] = useState(2);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isUpdatingRef = useRef(false);
  
  // NEW: Instead of just saving range, save the actual table elements
  const lastTableContext = useRef<{
    table: HTMLTableElement;
    row: HTMLTableRowElement;
    cell: HTMLTableCellElement;
  } | null>(null);

  // Force P tags
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.execCommand('defaultParagraphSeparator', false, 'p');
    }
  }, []);

  // Sync value
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
        setWordCount(countWords(value || ''));
      }
    }
  }, [value]);

  // Track table context whenever user clicks or moves cursor
  const updateTableContext = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    
    let node = sel.anchorNode;
    if (node?.nodeType === Node.TEXT_NODE) node = node.parentNode;
    
    const element = node as HTMLElement | null;
    if (!element || !editorRef.current?.contains(element)) return;

    // Check if we are inside a table
    const cell = element.closest('td, th') as HTMLTableCellElement | null;
    const row = element.closest('tr') as HTMLTableRowElement | null;
    const table = element.closest('table') as HTMLTableElement | null;

    if (table && row && cell && editorRef.current.contains(table)) {
      lastTableContext.current = { table, row, cell };
    } else {
      lastTableContext.current = null;
    }
  }, []);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    
    const events = ['mouseup', 'keyup', 'click'];
    events.forEach(ev => el.addEventListener(ev, updateTableContext));
    
    return () => {
      events.forEach(ev => el.removeEventListener(ev, updateTableContext));
    };
  }, [updateTableContext]);

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

  const execCmd = (command: string, value?: string) => {
    editorRef.current?.focus();
    
    // Safety check for lists/alignment
    if (['insertUnorderedList', 'insertOrderedList', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent'].includes(command)) {
        const sel = window.getSelection();
        if (sel && sel.anchorNode) {
            const parent = sel.anchorNode.nodeType === Node.TEXT_NODE 
                ? sel.anchorNode.parentElement 
                : sel.anchorNode as HTMLElement;
            
            if (parent === editorRef.current) {
                document.execCommand('formatBlock', false, 'p');
            }
        }
    }

    document.execCommand(command, false, value);
    handleTextChange();
  };

  const preventFocusLoss = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // --- TABLE OPERATIONS ---

  const insertTable = () => {
    editorRef.current?.focus();
    if (!editorRef.current) return;

    const rows = Array.from({ length: tableRows });
    const cols = Array.from({ length: tableCols });

    const tableHTML = `
      <table class="rte-table" style="border-collapse: collapse; width: 100%; margin: 10px 0; table-layout: fixed;">
        <tbody>
        ${rows.map(() => `
          <tr>
            ${cols.map(() =>
              `<td style="padding:8px;border:1px solid #ddd;min-width:80px;word-wrap:break-word;">&nbsp;</td>`
            ).join('')}
          </tr>
        `).join('')}
        </tbody>
      </table>
      <p><br/></p>
    `;

    document.execCommand('insertHTML', false, tableHTML);
    handleTextChange();
    setShowTableModal(false);
    setTableRows(2);
    setTableCols(2);
  };

  const addRowToTable = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!lastTableContext.current) {
      alert('Please click inside a table cell first, then try again.');
      return;
    }
    
    const { table, row } = lastTableContext.current;
    
    // Verify table is still in DOM
    if (!editorRef.current?.contains(table)) {
      alert('Table reference lost. Please click inside the table again.');
      lastTableContext.current = null;
      return;
    }
    
    const newRow = table.insertRow(row.rowIndex + 1);
    const colCount = row.cells.length;
    
    for (let i = 0; i < colCount; i++) {
      const c = newRow.insertCell();
      c.style.padding = '8px';
      c.style.border = '1px solid #ddd';
      c.style.minWidth = '100px';
      c.innerHTML = '&nbsp;';
    }
    
    handleTextChange();
  };

  const addColumnToTable = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!lastTableContext.current) {
      alert('Please click inside a table cell first, then try again.');
      return;
    }
    
    const { table, cell } = lastTableContext.current;
    
    if (!editorRef.current?.contains(table)) {
      alert('Table reference lost. Please click inside the table again.');
      lastTableContext.current = null;
      return;
    }
    
    const cellIndex = cell.cellIndex;
    
    for (let i = 0; i < table.rows.length; i++) {
      const row = table.rows[i];
      const newCell = row.insertCell(cellIndex + 1);
      newCell.style.padding = '8px';
      newCell.style.border = '1px solid #ddd';
      newCell.style.minWidth = '100px';
      newCell.innerHTML = '&nbsp;';
    }
    
    handleTextChange();
  };

  const deleteRowFromTable = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!lastTableContext.current) {
      alert('Please click inside a row to delete it.');
      return;
    }
    
    const { table, row } = lastTableContext.current;
    
    if (!editorRef.current?.contains(table)) {
      alert('Table reference lost. Please click inside the table again.');
      lastTableContext.current = null;
      return;
    }
    
    if (table.rows.length <= 1) {
      table.remove();
      lastTableContext.current = null;
    } else {
      row.remove();
    }
    
    handleTextChange();
  };

  const deleteColumnFromTable = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!lastTableContext.current) {
      alert('Please click inside a column to delete it.');
      return;
    }
    
    const { table, cell } = lastTableContext.current;
    
    if (!editorRef.current?.contains(table)) {
      alert('Table reference lost. Please click inside the table again.');
      lastTableContext.current = null;
      return;
    }
    
    const cellIndex = cell.cellIndex;
    
    if (table.rows[0].cells.length <= 1) {
      table.remove();
      lastTableContext.current = null;
    } else {
      for (let i = 0; i < table.rows.length; i++) {
        if (table.rows[i].cells[cellIndex]) {
          table.rows[i].deleteCell(cellIndex);
        }
      }
    }
    
    handleTextChange();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    editorRef.current?.focus();
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = `<img src="${event.target?.result}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px;" />`;
          document.execCommand('insertHTML', false, img);
          handleTextChange();
        };
        reader.readAsDataURL(file);
      }
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3 relative">
      <style jsx global>{`
        .rte ul { 
            display: block; 
            list-style-type: disc !important; 
            list-style-position: inside !important; 
            margin: 1rem 0 !important; 
            padding-left: 1rem !important; 
        }
        .rte ol { 
            display: block; 
            list-style-type: decimal !important; 
            list-style-position: inside !important; 
            margin: 1rem 0 !important; 
            padding-left: 1rem !important; 
        }
        .rte li { 
            display: list-item !important; 
        }
        .rte-table td, .rte-table th { border: 1px solid #ddd; padding: 8px; vertical-align: top; }
        .rte-table { border-collapse: collapse; width: 100%; table-layout: fixed; margin-bottom: 1em; }
        .editor-with-placeholder:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
      `}</style>

      <label className="block text-sm font-semibold text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {helperText && (
        <p className="text-xs text-[#64748B]" style={{ fontFamily: 'Metropolis, sans-serif', whiteSpace: 'pre-line' }}>
          {helperText}
        </p>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-white border-2 border-gray-300 rounded-t-lg select-none">
        
        <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('bold')} className="p-2 hover:bg-blue-100 rounded text-[#1E293B]" title="Bold">
          <Bold size={20} />
        </button>
        <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('italic')} className="p-2 hover:bg-blue-100 rounded text-[#1E293B]" title="Italic">
          <Italic size={20} />
        </button>
        <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('underline')} className="p-2 hover:bg-blue-100 rounded text-[#1E293B]" title="Underline">
          <Underline size={20} />
        </button>

        <div className="w-px h-6 bg-gray-400 mx-1" />

        <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('insertUnorderedList')} className="p-2 hover:bg-blue-100 rounded text-[#1E293B]" title="Bullet List">
          <ListIcon size={20} />
        </button>
        <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('insertOrderedList')} className="p-2 hover:bg-blue-100 rounded text-[#1E293B]" title="Numbered List">
          <ListOrdered size={20} />
        </button>

        <div className="w-px h-6 bg-gray-400 mx-1" />

        <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('justifyLeft')} className="p-2 hover:bg-blue-100 rounded text-[#1E293B]" title="Align Left">
          <AlignLeft size={20} />
        </button>
        <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('justifyCenter')} className="p-2 hover:bg-blue-100 rounded text-[#1E293B]" title="Align Center">
          <AlignCenter size={20} />
        </button>
        <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('justifyRight')} className="p-2 hover:bg-blue-100 rounded text-[#1E293B]" title="Align Right">
          <AlignRight size={20} />
        </button>
        <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('justifyFull')} className="p-2 hover:bg-blue-100 rounded text-[#1E293B]" title="Justify">
          <AlignJustify size={20} />
        </button>

        <div className="w-px h-6 bg-gray-400 mx-1" />

        <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('indent')} className="p-2 hover:bg-blue-100 rounded text-[#1E293B]" title="Increase Indent">
          <Indent size={20} />
        </button>
        <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('outdent')} className="p-2 hover:bg-blue-100 rounded text-[#1E293B]" title="Decrease Indent">
          <Outdent size={20} />
        </button>

        <div className="w-px h-6 bg-gray-400 mx-1" />

        <button type="button" onMouseDown={preventFocusLoss} onClick={() => setShowTableModal(true)} className="p-2 hover:bg-yellow-100 rounded text-[#1E293B] hover:text-[#F59E0B]" title="Insert Table">
          <TableIcon size={20} />
        </button>
        <button type="button" onMouseDown={preventFocusLoss} onClick={addRowToTable} className="p-2 hover:bg-green-100 rounded text-[#1E293B] hover:text-green-600" title="Add Row">
          <Plus size={20} />
        </button>
        <button type="button" onMouseDown={preventFocusLoss} onClick={addColumnToTable} className="p-2 hover:bg-green-100 rounded text-[#1E293B] hover:text-green-600" title="Add Column">
          <Plus size={20} className="rotate-90" />
        </button>
        <button type="button" onMouseDown={preventFocusLoss} onClick={deleteRowFromTable} className="p-2 hover:bg-red-100 rounded text-[#1E293B] hover:text-red-600" title="Delete Row">
          <Minus size={20} />
        </button>
        <button type="button" onMouseDown={preventFocusLoss} onClick={deleteColumnFromTable} className="p-2 hover:bg-red-100 rounded text-[#1E293B] hover:text-red-600" title="Delete Column">
          <Minus size={20} className="rotate-90" />
        </button>

        <div className="w-px h-6 bg-gray-400 mx-1" />

        {!hideImageUpload && (
          <>
            <button type="button" onMouseDown={preventFocusLoss} onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-yellow-100 rounded text-[#1E293B] hover:text-[#F59E0B]" title="Upload Image">
              <ImageIcon size={20} />
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
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        />
      </div>

      <div className="flex justify-between items-center text-xs" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        <span className="text-[#64748B]">
          Word count: <span className="font-semibold text-[#1E293B]">{wordCount}</span> {wordCount === 1 ? 'word' : 'words'}
        </span>
      </div>

      {showTableModal && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          onClick={() => setShowTableModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-96 max-w-[min(24rem,90%)] shadow-xl"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
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
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-black font-semibold"
                  style={{ fontFamily: 'Metropolis, sans-serif', color: 'black' }} 
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
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-black font-semibold"
                  style={{ fontFamily: 'Metropolis, sans-serif', color: 'black' }}
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
