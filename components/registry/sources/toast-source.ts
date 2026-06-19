/** Install command + copyable source for the "toast" component. */
export const installCommand = "npx goatui add toast";

export const source = `import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function ToastDemo() {
  const [open, setOpen] = useState(true);
  return (
    <button
      onClick={() => setOpen(true)}
      className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white border-0 cursor-pointer"
    >
      Trigger Toast
    </button>
  );
}`;
