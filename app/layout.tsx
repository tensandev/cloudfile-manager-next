import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "cloudfile-manager-next",
  description: "A sophisticated interface for browsing and managing files on your cloud servers via SSH",
  keywords: ["SSH", "file manager", "cloud", "server management", "file browser"],
  authors: [{ name: "cloudfile-manager-next team" }],
  creator: "cloudfile-manager-next",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
