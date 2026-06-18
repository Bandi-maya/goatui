import { Badge } from "@/components/ui/badge"

export default function BadgePage() {
  return (
    <div className="flex flex-col space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Badge</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Displays a badge or a component that looks like a badge.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Preview</h2>
        <div className="flex items-center justify-center p-10 border rounded-lg bg-card">
          <Badge>Badge</Badge>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Variants</h2>
        <div className="flex flex-wrap gap-4 p-6 border rounded-lg items-center justify-center">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Installation</h2>
        <div className="p-4 bg-muted rounded-lg font-mono text-sm">
          <p>npx goatui add badge</p>
        </div>
      </div>

    </div>
  )
}
