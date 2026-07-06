import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface TreeNodeType {
  id: string;
  label: string;
  children?: TreeNodeType[];
}

export interface TreeViewProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: TreeNodeType[];
  activeId?: string;
  onNodeSelect?: (node: TreeNodeType) => void;
}

interface TreeNodeProps {
  node: TreeNodeType;
  activeId?: string;
  onNodeSelect?: (node: TreeNodeType) => void;
  depth: number;
}

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const TreeView = React.forwardRef<HTMLDivElement, TreeViewProps>((
  {
    className,
    data = [], // Array of { id: "...", label: "...", children: [...] }
    activeId,
    onNodeSelect,
    ...props
  },
  ref
) => {
  return (
    <div
      ref={ref}
      className={clsx("flex flex-col gap-0.5 text-left w-full select-none", className)}
      {...(props as any)}
    >
      {data.map(node => (
        <TreeNode
          key={node.id}
          node={node}
          activeId={activeId}
          onNodeSelect={onNodeSelect}
          depth={0}
        />
      ))}
    </div>
  );
})
TreeView.displayName = "TreeView"

const TreeNode = ({ node, activeId, onNodeSelect, depth }: TreeNodeProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = node.id === activeId;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Node Element Row */}
      <div
        onClick={handleToggle}
        className={clsx(
          "flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold cursor-pointer select-none transition-colors w-full",
          isSelected 
            ? "bg-[var(--primary)]/10 text-[var(--primary)]" 
            : "text-[var(--foreground)] hover:bg-slate-50 dark:hover:bg-slate-800"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {/* Chevron for items with children */}
        {hasChildren ? (
          <motion.span
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.15 }}
            className="text-slate-400 shrink-0"
          >
            <svg className="h-3.5 w-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </motion.span>
        ) : (
          <span className="w-3.5 shrink-0" />
        )}

        {/* Icon folder or file */}
        <span className="text-slate-400 shrink-0">
          {hasChildren ? (
            isOpen ? (
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            ) : (
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            )
          ) : (
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          )}
        </span>

        <span className="truncate">{node.label}</span>
      </div>

      {/* Children list recursively */}
      <AnimatePresence initial={false}>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden flex flex-col"
          >
            {node.children!.map(child => (
              <TreeNode
                key={child.id}
                node={child}
                activeId={activeId}
                onNodeSelect={onNodeSelect}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export { TreeView }
export default TreeView
