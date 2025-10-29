// components/submission/RichTextEditor.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, 
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
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  helperText,
  maxWords = 0,
  required = false,
  placeholder = ''
}) => {
  const [wordCount, setWordCount] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(2);
  const [tableCols, setTableCols] = useState(2);
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isUpdatingRef = useRef(false); 

  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
        setWordCount(countWords(value || ''));
      }
    }
  }, [value]);

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

  // Handle focus - hide placeholder
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Handle blur - show placeholder if empty
  const handleBlur = () => {
    setIsFocused(false);
    handleTextChange();
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleTextChange();
  };

const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  setUploadedFiles(prev => [...prev, ...files]);
  
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = `<img src="${event.target?.result}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px;" />`;
        
        // Insert image
        if (editorRef.current) {
          editorRef.current.focus();
          document.execCommand('insertHTML', false, img);
          
          // ✅ Force immediate update
          setTimeout(() => {
            handleTextChange();
            console.log('✅ Image inserted, onChange called');
          }, 100);
        }
      };
      reader.readAsDataURL(file);
    }
  });
};

  const insertTable = () => {
    editorRef.current?.focus();
    
    let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0; table-layout: fixed;">';
    
    for (let i = 0; i < tableRows; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < tableCols; j++) {
        tableHTML += `<td contenteditable="true" style="padding: 8px; border: 1px solid #ddd; min-width: 80px; word-wrap: break-word;">Cell ${i + 1}-${j + 1}</td>`;
      }
      tableHTML += '</tr>';
    }
    
    tableHTML += '</table><p><br></p>';
    
    if (editorRef.current) {
      const selection = window.getSelection();
      const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      
      if (range) {
        document.execCommand('insertHTML', false, tableHTML);
      } else {
        editorRef.current.innerHTML += tableHTML;
      }
      
      setTimeout(() => {
        handleTextChange();
        editorRef.current?.focus();
      }, 100);
    }
    
    setShowTableModal(false);
    setTableRows(2);
    setTableCols(2);
  };

  const addRowToTable = () => {
    const selection = window.getSelection();
    if (!selection || !selection.anchorNode) return;
    
    let element = selection.anchorNode as HTMLElement;
    while (element && element !== editorRef.current) {
      if (element.tagName === 'TABLE') {
        const table = element as HTMLTableElement;
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
        return;
      }
      element = element.parentElement as HTMLElement;
    }
    
    alert('Please click inside a table to add a row');
  };

  const addColumnToTable = () => {
    const selection = window.getSelection();
    if (!selection || !selection.anchorNode) return;
    
    let element = selection.anchorNode as HTMLElement;
    while (element && element !== editorRef.current) {
      if (element.tagName === 'TABLE') {
        const table = element as HTMLTableElement;
        
        for (let i = 0; i < table.rows.length; i++) {
          const cell = table.rows[i].insertCell();
          cell.contentEditable = 'true';
          cell.style.padding = '8px';
          cell.style.border = '1px solid #ddd';
          cell.style.minWidth = '100px';
          cell.textContent = 'New Cell';
        }
        
        handleTextChange();
        return;
      }
      element = element.parentElement as HTMLElement;
    }
    
    alert('Please click inside a table to add a column');
  };

  const deleteRowFromTable = () => {
    const selection = window.getSelection();
    if (!selection || !selection.anchorNode) return;
    
    let element = selection.anchorNode as HTMLElement;
    while (element && element !== editorRef.current) {
      if (element.tagName === 'TR') {
        const table = element.closest('table') as HTMLTableElement;
        if (table.rows.length > 1) {
          element.remove();
          handleTextChange();
        } else {
          alert('Cannot delete the last row');
        }
        return;
      }
      element = element.parentElement as HTMLElement;
    }
    
    alert('Please click inside a table row to delete it');
  };

  const deleteColumnFromTable = () => {
    const selection = window.getSelection();
    if (!selection || !selection.anchorNode) return;
    
    let element = selection.anchorNode as HTMLElement;
    let cellIndex = -1;
    
    while (element && element !== editorRef.current) {
      if (element.tagName === 'TD' || element.tagName === 'TH') {
        const cell = element as HTMLTableCellElement;
        cellIndex = cell.cellIndex;
        
        const table = cell.closest('table') as HTMLTableElement;
        if (table.rows[0].cells.length > 1) {
          for (let i = 0; i < table.rows.length; i++) {
            table.rows[i].deleteCell(cellIndex);
          }
          handleTextChange();
        } else {
          alert('Cannot delete the last column');
        }
        return;
      }
      element = element.parentElement as HTMLElement;
    }
    
    alert('Please click inside a table cell to delete the column');
  };

  const cleanValue = value?.replace(/<[^>]*>/g, '').trim() || '';
  const isEmpty = cleanValue === '';

  return (
    <div className="space-y-3">
      {/* Label - Now accepts JSX/React.ReactNode */}
      <label className="block text-sm font-semibold text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {/* Helper Text */}
      {helperText && (
        <p className="text-xs text-[#64748B]" style={{ fontFamily: 'Metropolis, sans-serif' , whiteSpace: 'pre-line' }}>
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
        
        <div className="w-px h-6 bg-gray-400 mx-1"></div>
        
        <button type="button" onClick={() => applyFormat('insertUnorderedList')} className="p-2 hover:bg-blue-100 rounded transition-colors text-[#1E293B] hover:text-[#3B82F6]" title="Bullet List">
          <List size={20} strokeWidth={2.5} />
        </button>
        <button type="button" onClick={() => applyFormat('insertOrderedList')} className="p-2 hover:bg-blue-100 rounded transition-colors text-[#1E293B] hover:text-[#3B82F6]" title="Numbered List">
          <ListOrdered size={20} strokeWidth={2.5} />
        </button>
        
        <div className="w-px h-6 bg-gray-400 mx-1"></div>
        
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
        
        <div className="w-px h-6 bg-gray-400 mx-1"></div>
        
        <button type="button" onClick={() => applyFormat('indent')} className="p-2 hover:bg-blue-100 rounded transition-colors text-[#1E293B] hover:text-[#3B82F6]" title="Increase Indent">
          <Indent size={20} strokeWidth={2.5} />
        </button>
        <button type="button" onClick={() => applyFormat('outdent')} className="p-2 hover:bg-blue-100 rounded transition-colors text-[#1E293B] hover:text-[#3B82F6]" title="Decrease Indent">
          <Outdent size={20} strokeWidth={2.5} />
        </button>
        
        <div className="w-px h-6 bg-gray-400 mx-1"></div>
        
        <button type="button" onClick={() => setShowTableModal(true)} className="p-2 hover:bg-yellow-100 rounded transition-colors text-[#1E293B] hover:text-[#F59E0B]" title="Insert Table">
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
        
        <div className="w-px h-6 bg-gray-400 mx-1"></div>
        
        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-yellow-100 rounded transition-colors text-[#1E293B] hover:text-[#F59E0B]" title="Upload Image">
          <ImageIcon size={20} strokeWidth={2.5} />
        </button>
        
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
      </div>

      {/* Editor with Placeholder */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          suppressContentEditableWarning
          data-placeholder={placeholder || ''}
          className="editor-with-placeholder w-full h-[400px] p-4 border-2 border-gray-300 rounded-b-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B] bg-white overflow-auto relative"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        />
      </div>

      {/* Word Count Display - Always show, no limit enforcement */}
      <div className="flex justify-between items-center text-xs" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        <span className="text-[#64748B]">
          Word count: <span className="font-semibold text-[#1E293B]">{wordCount}</span> {wordCount === 1 ? 'word' : 'words'}
        </span>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-semibold text-[#1E293B] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Uploaded files:
          </p>
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {file.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
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
                  min="1"
                  max="20"
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value) || 2)}
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
                  min="1"
                  max="10"
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value) || 2)}
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
