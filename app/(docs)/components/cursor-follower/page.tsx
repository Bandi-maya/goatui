import { CursorFollower } from "@/components/ui/cursor-follower"

export default function CursorFollowerPage() {
  return (
    <div className="flex flex-col space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Cursor Follower</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Documentation for the Cursor Follower component.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Preview</h2>
        <div className="flex items-center justify-center p-10 border rounded-lg bg-card">
          <CursorFollower />
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Installation</h2>
        <div className="p-4 bg-muted rounded-lg font-mono text-sm">
          <p>npx goatui add cursor-follower</p>
        </div>
      </div>
    </div>
  )
}
