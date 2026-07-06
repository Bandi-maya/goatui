import * as React from "react"

export interface AvatarProps extends React.HTMLAttributes<any> {
  size?: string;
}

export interface AvatarImageProps extends React.HTMLAttributes<any> {
  src?: any;
  alt?: any;
}

export interface AvatarFallbackProps extends React.HTMLAttributes<any> {
}

export interface AvatarGroupProps extends React.HTMLAttributes<any> {
}


const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>((
  {
    className, size = "default", ...props
  },
  ref
) => {
  return (
    <div
      ref={ref}
      className={clsx(
        "relative flex shrink-0 overflow-hidden rounded-full border border-[var(--border)]",
        size === "sm" && "h-8 w-8 text-xs",
        size === "default" && "h-10 w-10 text-sm",
        size === "lg" && "h-12 w-12 text-base",
        size === "xl" && "h-16 w-16 text-lg",
        className
      )}
      {...props}
    />
  )
})
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>((
  {
    className, src, alt, ...props
  },
  ref
) => {
  const [hasFailed, setHasFailed] = React.useState(false);

  if (hasFailed || !src) return null;

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      onError={() => setHasFailed(true)}
      className={clsx("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  )
})
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>((
  {
    className, children, ...props
  },
  ref
) => {
  return (
    <div
      ref={ref}
      className={clsx(
        "flex h-full w-full items-center justify-center rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] font-bold select-none uppercase",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
AvatarFallback.displayName = "AvatarFallback"

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>((
  {
    className, children, ...props
  },
  ref
) => {
  return (
    <div
      ref={ref}
      className={clsx("flex -space-x-3 items-center", className)}
      {...props}
    >
      {children}
    </div>
  )
})
AvatarGroup.displayName = "AvatarGroup"

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup }
export default Avatar
