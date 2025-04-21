"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Save, Download } from "lucide-react"
import type { SSHConnection } from "@/lib/types"
import { CircularAnimation } from "@/components/circular-animation"

interface FileEditorProps {
  connection: SSHConnection
  filePath: string
}

export function FileEditor({ connection, filePath }: FileEditorProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    // In a real app, we would fetch the file content via SSH
    // For now, we'll simulate it
    setLoading(true)
    setError(null)
    setSaveSuccess(false)

    const extension = filePath.split(".").pop()?.toLowerCase()

    setTimeout(() => {
      if (extension) {
        if (["txt", "js", "jsx", "ts", "tsx", "html", "css", "json", "md"].includes(extension)) {
          // Generate some sample content based on the file extension
          if (extension === "html") {
            setContent(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample File</title>
</head>
<body>
  <h1>Hello World</h1>
  <p>This is a sample HTML file for ${filePath}</p>
</body>
</html>`)
          } else if (["js", "jsx", "ts", "tsx"].includes(extension)) {
            setContent(`// Sample JavaScript file
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
// This is a sample file for ${filePath}`)
          } else if (extension === "css") {
            setContent(`/* Sample CSS file */
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 20px;
  color: #333;
}

h1 {
  color: #0066cc;
}

/* This is a sample file for ${filePath} */`)
          } else if (extension === "json") {
            setContent(`{
  "name": "sample-file",
  "version": "1.0.0",
  "description": "A sample JSON file for ${filePath}",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": [
    "sample",
    "json"
  ],
  "author": "",
  "license": "MIT"
}`)
          } else if (extension === "md") {
            setContent(`# Sample Markdown File

## Introduction

This is a sample markdown file for ${filePath}.

## Features

- Feature 1
- Feature 2
- Feature 3

## Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

## Conclusion

Thank you for using our service!`)
          } else {
            setContent(`This is a sample text file for ${filePath}.

It contains some plain text content that you can edit.

Feel free to make changes and save the file.`)
          }
        } else {
          setError("This file type cannot be edited")
        }
      } else {
        setError("Unknown file type")
      }

      setLoading(false)
    }, 1000)
  }, [filePath, connection])

  const handleSave = () => {
    // In a real app, we would save the file via SSH
    // For now, we'll simulate it
    setIsSaving(true)

    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    }, 1000)
  }

  return (
    <div className="h-[600px] flex flex-col">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-sm font-medium">{filePath.split("/").pop()}</h3>
        <div className="flex gap-2 items-center">
          {saveSuccess && <span className="text-xs text-green-600">SAVED SUCCESSFULLY</span>}
          <Button
            variant="outline"
            size="sm"
            className="text-xs uppercase"
            onClick={handleSave}
            disabled={loading || isSaving}
          >
            <Save className="w-4 h-4 mr-1" />
            {isSaving ? "SAVING..." : "SAVE"}
          </Button>
          <Button variant="outline" size="sm" className="text-xs uppercase">
            <Download className="w-4 h-4 mr-1" />
            DOWNLOAD
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center">
              <CircularAnimation size={32} />
              <p className="text-sm text-gray-600 mt-4">LOADING FILE...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-sm text-gray-600">{error}</p>
              <p className="text-xs text-gray-500 mt-1">Try downloading the file instead</p>
            </div>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none"
            spellCheck={false}
          />
        )}
      </div>
    </div>
  )
}
