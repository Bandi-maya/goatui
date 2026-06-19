/** Install command + copyable source for the "input" component. */
export const installCommand = "npx goatui add input";

export const source = `import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function CustomInput() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-full max-w-sm space-y-1.5 text-left">
      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        Email Address
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          className="flex h-10 w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-zinc-800"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">We'll never share your data.</p>
    </div>
  );
}`;
