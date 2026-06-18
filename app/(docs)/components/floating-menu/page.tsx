import { FloatingMenu } from "@/components/ui/floating-menu"

export default function FloatingMenuPage() {
  return (
    <div className="flex flex-col space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Floating Menu</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Documentation for the Floating Menu component.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Preview</h2>
        <div className="flex items-center justify-center p-10 border rounded-lg bg-card">
          <FloatingMenu />
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Installation</h2>
        <div className="p-4 bg-muted rounded-lg font-mono text-sm">
          <p>npx goatui add floating-menu</p>
        </div>
      </div>
    </div>
  )
}
