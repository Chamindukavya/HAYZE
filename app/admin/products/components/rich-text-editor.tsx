import { useEffect, useRef } from "react";
import { Bold, Italic, List, ListOrdered } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleCommand = (e: React.MouseEvent, command: string, arg?: string) => {
    e.preventDefault();
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      editorRef.current.focus();
    }
  };

  return (
    <div className="w-full bg-zinc-950 border border-white/5 rounded-lg overflow-hidden transition-colors focus-within:border-white/20">
      <div className="flex items-center gap-1 border-b border-white/5 p-2 bg-zinc-900/50">
        <button type="button" onClick={(e) => handleCommand(e, 'bold')} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Bold"><Bold size={14} /></button>
        <button type="button" onClick={(e) => handleCommand(e, 'italic')} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Italic"><Italic size={14} /></button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button type="button" onClick={(e) => handleCommand(e, 'insertUnorderedList')} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Bullet List"><List size={14} /></button>
        <button type="button" onClick={(e) => handleCommand(e, 'insertOrderedList')} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Numbered List"><ListOrdered size={14} /></button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        className="px-4 py-3 min-h-30 text-sm focus:outline-none outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_b]:font-bold [&_i]:italic"
      />
    </div>
  );
};
