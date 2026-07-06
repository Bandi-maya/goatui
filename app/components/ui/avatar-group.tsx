import * as React from "react"
import { clsx } from "clsx"

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: "sm" | "default" | "lg";
}


const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>((
  {
    className,
  children,
  max = 3,
  size = "default", // "sm" | "default" | "lg"
  ...props
  },
  ref
) => {
  const childrenArray = React.Children.toArray(children);
  const visibleAvatars = childrenArray.slice(0, max);
  const extraCount = childrenArray.length - max;

  const ringClass = "ring-2 ring-white dark:ring-slate-950";

  return (
    <div
      ref={ref}
      className={clsx("flex items-center -space-x-2.5 select-none", className)}
      {...props}
    >
      {visibleAvatars.map((child, index) => {
        if (React.isValidElement(child)) {
          const element = child as React.ReactElement<any>;
          return React.cloneElement(element, {
            size,
            className: clsx(element.props.className, ringClass, "hover:z-10 hover:scale-105 transition-transform duration-200")
          });
        }
        return child;
      })}
      {extraCount > 0 && (
        <div
          className={clsx(
            "flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-2 border-white dark:border-slate-950 z-0 select-none",
            size === "sm" ? "h-7 w-7 text-[10px]" : size === "lg" ? "h-11 w-11 text-sm" : "h-9 w-9 text-xs"
          )}
        >
          +{extraCount}
        </div>
      )}
    </div>
  );
})
AvatarGroup.displayName = "AvatarGroup"

export { AvatarGroup }
export default AvatarGroup
