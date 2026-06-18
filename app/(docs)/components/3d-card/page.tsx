import { ThreeDCard } from "@/components/ui/3d-card"

export default function ThreeDCardPage() {
  return (
    <div className="flex flex-col space-y-8 text-left">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">3D Card</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Documentation for the 3D Card component.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Preview</h2>
        <div className="flex items-center justify-center p-10 border rounded-lg bg-card">
          <ThreeDCard />
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Installation</h2>
        <div className="p-4 bg-muted rounded-lg font-mono text-sm">
          <p>npx goatui add 3d-card</p>
        </div>
      </div>
    </div>
  )
}
