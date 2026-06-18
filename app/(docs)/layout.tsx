import Navbar from "@/components/Navbar"
import { Sidebar } from "@/components/sidebar"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Premium Integrated Header */}
      <Navbar />

      {/* Main Container Layout */}
      <div className="flex-1 flex justify-center w-full">
        <div className="w-full max-w-7xl flex px-6 sm:px-8">
          
          {/* Sidebar Area */}
          <aside className="hidden md:block w-64 lg:w-72 shrink-0 border-r border-border h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto pr-6 py-8 scrolling-touch">
            <Sidebar />
          </aside>

          {/* Docs Content */}
          <main className="flex-1 min-w-0 py-8 pl-0 md:pl-8 lg:pl-10">
            <div className="max-w-4xl mx-auto">
              {children}
            </div>
          </main>

        </div>
      </div>
    </div>
  )
}
