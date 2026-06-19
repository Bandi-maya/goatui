/** Install command + copyable source for the "button" component. */
export const installCommand = "npx goatui add button";

export const source = `import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export default function CustomButton() {
  return (
    <button
      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 active:scale-95"
    >
      <Sparkles className="mr-2 h-4 w-4" />
      Click Me
    </button>
  );
}`;
