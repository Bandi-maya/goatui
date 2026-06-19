/** Install command + copyable source for the "rating" component. */
export const installCommand = "npx goatui add rating";

export const source = `import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function CustomRating() {
  const [score, setScore] = useState(4);
  const [hoverScore, setHoverScore] = useState(0);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => setScore(val)}
            onMouseEnter={() => setHoverScore(val)}
            onMouseLeave={() => setHoverScore(0)}
            className="cursor-pointer p-1 transition-transform hover:scale-110"
          >
            <Star
              className={\`h-6 w-6 transition-all \${
                val <= (hoverScore || score)
                  ? 'fill-amber-400 stroke-amber-400 text-amber-400'
                  : 'stroke-slate-400 text-transparent'
              }\`}
            />
          </button>
        ))}
      </div>
      <span className="select-none text-xs font-semibold text-slate-500">
        Current Score: {score} / 5.0
      </span>
    </div>
  );
}`;
