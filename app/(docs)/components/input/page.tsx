import { Input } from "@/components/ui/input"

export default function InputPage() {
  return (
    <div className="flex flex-col space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Input</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Displays a form input field or a component that looks like an input field.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Preview</h2>
        <div className="flex items-center justify-center p-10 border rounded-lg bg-card max-w-sm mx-auto w-full">
          <Input type="email" placeholder="Email" />
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 border rounded-lg">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Default</span>
            <Input type="text" placeholder="Username" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Disabled</span>
            <Input disabled type="text" placeholder="Disabled" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">File</span>
            <Input type="file" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Password</span>
            <Input type="password" placeholder="Password" />
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Installation</h2>
        <div className="p-4 bg-muted rounded-lg font-mono text-sm">
          <p>npx goatui add input</p>
        </div>
      </div>

    </div>
  )
}
