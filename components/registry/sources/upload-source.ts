/** Install command + copyable source for the "upload" component. */
export const installCommand = "npx goatui add upload";

export const source = `import React, { useState } from 'react';
import { UploadCloud, CheckCircle2 } from 'lucide-react';

export default function FileDropzone() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<string | null>(null);

  return (
    <div className="w-full max-w-sm text-left">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0].name);
        }}
        className={\`flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all \${
          dragActive ? 'border-blue-500 bg-blue-600/5' : 'border-slate-200 hover:border-blue-500/50 dark:border-zinc-800'
        }\`}
      >
        <UploadCloud className="mb-2 h-8 w-8 text-blue-600" />
        <span className="text-xs font-bold text-foreground">Click or drag a file</span>
        <p className="mt-1 text-[10px] text-muted-foreground">Supports ZIP, TAR up to 64MB.</p>
      </div>
      {file && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 p-2.5 text-xs font-semibold text-green-700 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span className="truncate">Staged: {file}</span>
        </div>
      )}
    </div>
  );
}`;
