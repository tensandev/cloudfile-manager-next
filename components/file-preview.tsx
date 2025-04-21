"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink } from "lucide-react"
import type { SSHConnection } from "@/lib/types"
import { CircularAnimation } from "@/components/circular-animation"

interface FilePreviewProps {
  connection: SSHConnection
  filePath: string
}

export function FilePreview({ connection, filePath }: FilePreviewProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fileType, setFileType] = useState<string | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)

  useEffect(() => {
    // In a real app, we would fetch the file via SSH
    // For now, we'll simulate it
    setLoading(true)
    setError(null)

    const extension = filePath.split(".").pop()?.toLowerCase()

    setTimeout(() => {
      if (extension) {
        if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
          setFileType("image")
          // Use a placeholder image
          setFileUrl(`/placeholder.svg?height=600&width=800&query=preview of ${filePath}`)
        } else if (extension === "pdf") {
          setFileType("pdf")
          setFileUrl("/sample.pdf")
        } else {
          setError("Preview not available for this file type")
        }
      } else {
        setError("Unknown file type")
      }

      setLoading(false)
    }, 1000)
  }, [filePath, connection])

  return (
    <div className="h-[600px] flex flex-col">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-sm font-medium">{filePath.split("/").pop()}</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs uppercase">
            <Download className="w-4 h-4 mr-1" />
            DOWNLOAD
          </Button>
          <Button variant="outline" size="sm" className="text-xs uppercase">
            <ExternalLink className="w-4 h-4 mr-1" />
            OPEN
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center">
              <CircularAnimation size={32} />
              <p className="text-sm text-gray-600 mt-4">LOADING PREVIEW...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-sm text-gray-600">{error}</p>
              <p className="text-xs text-gray-500 mt-1">Try downloading the file instead</p>
            </div>
          </div>
        ) : fileType === "image" && fileUrl ? (
          <div className="flex items-center justify-center h-full">
            <img src={fileUrl || "/placeholder.svg"} alt={filePath} className="max-w-full max-h-full object-contain" />
          </div>
        ) : fileType === "pdf" && fileUrl ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-sm text-gray-600">PDF Preview</p>
              <p className="text-xs text-gray-500 mt-1">PDF preview is not available in this demo</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-sm text-gray-600">Preview not available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
