import { Pricing2 } from "@/components/ui/pricing-2"

export default function Pricing2Page() {
  return (
    <div className="flex flex-col space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Pricing 2</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Documentation for the Pricing 2 component.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Preview</h2>
        <div className="flex items-center justify-center p-10 border rounded-lg bg-card">
          <Pricing2 />
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Installation</h2>
        <div className="p-4 bg-muted rounded-lg font-mono text-sm">
          <p>npx goatui add pricing-2</p>
        </div>
      </div>
    </div>
  )
}
