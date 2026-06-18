import Link from "next/link";
import Layout from "@/components/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 sm:py-32 text-center relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/5 blur-[100px]" />
        
        <div className="text-sm font-semibold tracking-wider text-red-500 uppercase">404 Error</div>
        
        <h1 className="mt-4 text-4xl font-extrabold sm:text-6xl tracking-tight bg-gradient-to-r from-red-400 to-indigo-400 bg-clip-text text-transparent">
          Page Not Found
        </h1>
        
        <p className="mt-6 text-zinc-400 max-w-md text-base leading-7">
          Sorry, we couldn&apos;t find the page you are looking for. It might have been moved or deleted.
        </p>
        
        <div className="mt-10">
          <Link href="/">
            <wc-button variant="filled" color="primary" className="shadow-lg shadow-teal-500/10">
              Return Home
            </wc-button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
