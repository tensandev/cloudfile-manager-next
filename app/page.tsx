import { Suspense } from "react"
import Link from "next/link"
import { FileManager } from "@/components/file-manager"
import { GradientBlob } from "@/components/gradient-blob"
import { CircularAnimation } from "@/components/circular-animation"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f8f8] relative overflow-hidden">
      {/* Gradient blobs in corners */}
      <div className="fixed top-0 left-0 -z-10 opacity-20">
        <GradientBlob />
      </div>
      <div className="fixed bottom-0 right-0 -z-10 opacity-20">
        <GradientBlob />
      </div>

      {/* Header */}
      <header className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CircularAnimation size={40} />
            <h1 className="text-2xl font-light tracking-tight">CLOUD FILE MANAGER</h1>
          </div>
          <nav>
            <ul className="flex gap-8">
              <li>
                <Link href="#" className="text-xs uppercase tracking-wider hover:text-gray-500 transition-colors">
                  ABOUT
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs uppercase tracking-wider hover:text-gray-500 transition-colors">
                  DOCS
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs uppercase tracking-wider hover:text-gray-500 transition-colors">
                  SUPPORT
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <h2 className="text-6xl font-light tracking-tight mb-6">
            Manage your files
            <br />
            with elegance
          </h2>
          <p className="text-sm text-gray-600 max-w-lg">
            A sophisticated interface for browsing and managing files on your cloud servers via SSH. Connect to multiple
            servers, preview files, and edit content directly in your browser.
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-16"></div>
        </section>

        <Suspense fallback={<div className="text-center py-12">LOADING...</div>}>
          <FileManager />
        </Suspense>
      </main>

      <footer className="container mx-auto py-8 px-4 mt-16">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8"></div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} CLOUD FILE MANAGER</p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs uppercase text-gray-500 hover:text-gray-700 transition-colors">
              PRIVACY
            </Link>
            <Link href="#" className="text-xs uppercase text-gray-500 hover:text-gray-700 transition-colors">
              TERMS
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
