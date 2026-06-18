import { ThreeDProductViewer } from "@/components/ui/3d-product-viewer"

export default function ThreeDProductViewerPage() {
  return (
    <div className="flex flex-col space-y-8 text-left">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">3D Product Viewer</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Documentation for the 3D Product Viewer component.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Preview</h2>
        <div className="flex items-center justify-center p-10 border rounded-lg bg-card">
          <ThreeDProductViewer />
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Installation</h2>
        <div className="p-4 bg-muted rounded-lg font-mono text-sm">
          <p>npx goatui add 3d-product-viewer</p>
        </div>
      </div>
    </div>
  )
}
