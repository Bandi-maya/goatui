import { Testimonial11 } from "@/components/ui/testimonial-11"

export default function Testimonial11Page() {
  return (
    <div className="flex flex-col space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Testimonial 11</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Documentation for the Testimonial 11 component.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Preview</h2>
        <div className="flex items-center justify-center p-10 border rounded-lg bg-card">
          <Testimonial11 />
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Installation</h2>
        <div className="p-4 bg-muted rounded-lg font-mono text-sm">
          <p>npx goatui add testimonial-11</p>
        </div>
      </div>
    </div>
  )
}
