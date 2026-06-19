/** Install command + copyable source for the "table" component. */
export const installCommand = "npx goatui add table";

export const source = `import React from 'react';

const rows = [
  { user: 'Alice', role: 'Admin', status: 'Active' },
  { user: 'Bob', role: 'Editor', status: 'Away' },
  { user: 'Carol', role: 'Viewer', status: 'Offline' },
];

export default function CustomUserTable() {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white text-left text-xs dark:border-zinc-800 dark:bg-zinc-950">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 font-semibold dark:bg-zinc-900">
            <th className="p-3">User</th>
            <th className="p-3">Role</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-slate-100 dark:border-zinc-800">
              <td className="p-3">{r.user}</td>
              <td className="p-3">{r.role}</td>
              <td className="p-3">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`;
