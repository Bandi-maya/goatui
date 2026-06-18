import { Button } from "@/components/ui/button"

export default function ButtonPage() {
  return (
    <div className="flex flex-col space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Button</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Displays a button or a component that looks like a button.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Preview</h2>
        <div className="flex items-center justify-center p-10 border rounded-lg bg-card">
          <Button variant="primary" size="lg">Click Me</Button>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Variants</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <Button variant="primary">Primary</Button>
            <span className="text-xs text-muted-foreground">primary</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button variant="secondary">Secondary</Button>
            <span className="text-xs text-muted-foreground">secondary</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button variant="outline">Outline</Button>
            <span className="text-xs text-muted-foreground">outline</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button variant="ghost">Ghost</Button>
            <span className="text-xs text-muted-foreground">ghost</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button variant="gradient">Gradient</Button>
            <span className="text-xs text-muted-foreground">gradient</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button variant="neon">Neon</Button>
            <span className="text-xs text-muted-foreground">neon</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-slate-900 rounded-md">
            <Button variant="glass">Glass</Button>
            <span className="text-xs text-muted-foreground mt-2">glass</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button loading>Loading</Button>
            <span className="text-xs text-muted-foreground">loading</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Installation</h2>
        <div className="p-4 bg-muted rounded-lg font-mono text-sm">
          <p>npx goatui add button</p>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Usage</h2>
        <div className="p-4 bg-muted rounded-lg font-mono text-sm whitespace-pre">
          {`import { Button } from "@/components/ui/button"

export default function App() {
  return (
    <Button variant="primary">
      Click Me
    </Button>
  )
}`}
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Accessibility</h2>
        <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
          <li>Keyboard focus management out of the box.</li>
          <li>Proper <code>aria-disabled</code> states when loading.</li>
          <li>Screen reader friendly with `radix-ui/react-slot`.</li>
        </ul>
      </div>

    </div>
  )
}
