import { MobileNav } from "@/components/ui/mobile-nav"

export default function MobileNavPage() {
  return (
    <div className="flex flex-col space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Mobile Nav</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Documentation for the Mobile Nav component.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Preview</h2>
        <div className="flex items-center justify-center p-10 border rounded-lg bg-card">
          <MobileNav />
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Installation</h2>
        <div className="p-4 bg-muted rounded-lg font-mono text-sm">
          <p>npx goatui add mobile-nav</p>
        </div>
      </div>
    </div>
  )
}
