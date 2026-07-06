import * as React from "react"
import { clsx } from "clsx"

export interface OTPInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  length?: number;
  value?: string;
  onChange?: (val: string) => void;
  onComplete?: (val: string) => void;
  disabled?: boolean;
  error?: boolean;
}

const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>((
  {
    className,
    length = 6,
    value = "",
    onChange,
    onComplete,
    disabled = false,
    error = false,
    ...props
  },
  ref
) => {
  const [code, setCode] = React.useState<string[]>(
    Array(length).fill("").map((_, i) => value[i] || "")
  );

  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  React.useEffect(() => {
    if (value !== undefined) {
      setCode(Array(length).fill("").map((_, i) => value[i] || ""));
    }
  }, [value, length]);

  const handleChange = (val: string, index: number) => {
    if (disabled) return;
    const sanitized = val.replace(/[^0-9a-zA-Z]/g, "").slice(-1);
    const newCode = [...code];
    newCode[index] = sanitized;
    setCode(newCode);

    const stringVal = newCode.join("");
    if (onChange) {
      onChange(stringVal);
    }

    // Auto-focus next input if filled
    if (sanitized && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check complete
    if (newCode.every(char => char !== "") && onComplete) {
      onComplete(stringVal);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (disabled) return;

    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        // Clear previous input and focus it
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
        if (onChange) onChange(newCode.join(""));
      } else {
        // Clear current input
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
        if (onChange) onChange(newCode.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    const pastedData = e.clipboardData.getData("text").trim();
    const cleanData = pastedData.replace(/[^0-9a-zA-Z]/g, "").slice(0, length);
    if (!cleanData) return;

    const newCode = Array(length).fill("").map((_, i) => cleanData[i] || "");
    setCode(newCode);
    const stringVal = newCode.join("");
    if (onChange) onChange(stringVal);

    // Focus last filled index or first empty index
    const targetFocusIndex = Math.min(cleanData.length, length - 1);
    inputRefs.current[targetFocusIndex]?.focus();

    if (cleanData.length === length && onComplete) {
      onComplete(stringVal);
    }
  };

  return (
    <div
      ref={ref}
      className={clsx(
        "flex items-center gap-2",
        error && "animate-shake",
        className
      )}
      {...props}
    >
      {code.map((char, index) => (
        <input
          key={index}
          ref={(node) => {
            inputRefs.current[index] = node;
          }}
          type="text"
          maxLength={1}
          value={char}
          disabled={disabled}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={clsx(
            "h-12 w-10 text-center text-lg font-bold rounded-xl border bg-transparent outline-none transition-all focus:ring-4 focus:ring-[var(--ring)]/25 text-[var(--foreground)]",
            error 
              ? "border-red-500 focus:border-red-500" 
              : "border-[var(--border)] focus:border-[var(--primary)]",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
      ))}
    </div>
  );
})
OTPInput.displayName = "OTPInput"

export { OTPInput }
export default OTPInput

