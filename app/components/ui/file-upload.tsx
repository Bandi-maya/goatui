import * as React from "react"

export interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  onFileSelect?: (files: FileList | null) => void;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  label?: string;
  description?: string;
}


const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>((
  {
    className,
  onFileSelect,
  accept,
  maxSize, // in MB
  multiple = false,
  label = "Upload file",
  description = "Drag & drop files here, or click to browse",
  ...props
  },
  ref
) => {
  const [isDragOver, setIsDragOver] = React.useState(false)
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [isUploading, setIsUploading] = React.useState(false)

  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files)
      processFiles(files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      processFiles(files)
    }
  }

  const processFiles = (files: File[]) => {
    // Validation
    const validFiles = files.filter((file: File) => {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} exceeds the maximum size of ${maxSize}MB.`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setSelectedFiles(multiple ? [...selectedFiles, ...validFiles] : [validFiles[0]])
    onFileSelect?.(multiple ? (validFiles as any) : validFiles[0])

    // Simulate progress animation
    setIsUploading(true)
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 150)
  }

  const triggerSelect = () => {
    inputRef.current?.click()
  }

  const removeFile = (index: number) => {
    const nextFiles = [...selectedFiles]
    nextFiles.splice(index, 1)
    setSelectedFiles(nextFiles)
  }

  return (
    <div className={clsx("w-full space-y-4", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerSelect}
        className={clsx(
          "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 bg-slate-50/20 dark:bg-slate-950/10 hover:bg-slate-50/50 dark:hover:bg-slate-950/20",
          isDragOver ? "border-[var(--primary)] bg-sky-500/5" : "border-[var(--border)]",
        )}
        {...(props as any)}
      >
        <input
          ref={(node) => {
            (inputRef as any).current = node
            if (typeof ref === "function") ref(node)
            else if (ref) (ref as any).current = node
          }}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 mb-4 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            className="h-5 w-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">{description}</p>
      </div>

      {isUploading && (
        <div className="space-y-1.5 p-4 border border-[var(--border)] rounded-xl bg-[var(--card)]">
          <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--primary)] transition-all duration-150"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {selectedFiles.length > 0 && !isUploading && (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Files:</p>
          <div className="space-y-1.5">
            {selectedFiles.map((file, idx) => (
              <div
                key={file.name + idx}
                className="flex items-center justify-between p-3 border border-[var(--border)] rounded-xl bg-[var(--card)] text-sm shadow-sm"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4 text-slate-400 shrink-0"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{file.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="h-4 w-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})
FileUpload.displayName = "FileUpload"

export { FileUpload }
export default FileUpload
