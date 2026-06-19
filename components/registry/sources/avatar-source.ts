/** Install command + copyable source for the "avatar" component. */
export const installCommand = "npx goatui add avatar";

export const source = `import React from 'react';

export default function CustomAvatar() {
  return (
    <div className="relative inline-block select-none">
      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 font-bold dark:border-zinc-800 dark:bg-zinc-800">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
          alt="User avatar"
          className="h-full w-full object-cover"
        />
      </div>
      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-zinc-950" />
    </div>
  );
}`;
