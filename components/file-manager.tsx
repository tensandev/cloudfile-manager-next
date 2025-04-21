"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ConnectionForm } from "@/components/connection-form"
import { FileBrowser } from "@/components/file-browser"
import { FilePreview } from "@/components/file-preview"
import { FileEditor } from "@/components/file-editor"
import { CircularAnimation } from "@/components/circular-animation"
import { DragDropInfo } from "@/components/drag-drop-info"
import { SelectionInfo } from "@/components/selection-info"
import { PermissionsInfo } from "@/components/permissions-info"
import type { SSHConnection } from "@/lib/types"

export function FileManager() {
  const [connections, setConnections] = useState<SSHConnection[]>([])
  const [activeConnection, setActiveConnection] = useState<SSHConnection | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [currentPath, setCurrentPath] = useState<string>("/")
  const [view, setView] = useState<"browser" | "preview" | "editor">("browser")

  const handleConnect = (connection: SSHConnection) => {
    // In a real app, we would establish the SSH connection here
    setConnections((prev) => [...prev, connection])
    setActiveConnection(connection)
  }

  const handleDisconnect = (id: string) => {
    // In a real app, we would close the SSH connection here
    setConnections((prev) => prev.filter((conn) => conn.id !== id))
    if (activeConnection?.id === id) {
      setActiveConnection(connections.length > 1 ? connections[0] : null)
    }
  }

  const handleSelectFile = (path: string) => {
    setSelectedFile(path)

    // Determine view based on file extension
    const extension = path.split(".").pop()?.toLowerCase()
    if (extension && ["txt", "js", "jsx", "ts", "tsx", "html", "css", "json", "md"].includes(extension)) {
      setView("editor")
    } else if (extension && ["jpg", "jpeg", "png", "gif", "svg", "pdf"].includes(extension)) {
      setView("preview")
    } else {
      setView("browser")
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <div className="border-r border-gray-100">
          <div className="p-6">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">CONNECTIONS</h3>

            {connections.length === 0 ? (
              <div className="text-center py-8">
                <CircularAnimation size={32} />
                <p className="text-sm text-gray-600 mt-4">NO ACTIVE CONNECTIONS</p>
                <p className="text-xs text-gray-500 mt-1">Connect to a server to begin</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {connections.map((connection) => (
                  <li
                    key={connection.id}
                    className={`p-3 text-sm rounded-md cursor-pointer transition-colors ${
                      activeConnection?.id === connection.id ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveConnection(connection)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{connection.name}</span>
                      <button
                        className="text-xs text-gray-500 hover:text-gray-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDisconnect(connection.id)
                        }}
                      >
                        DISCONNECT
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {connection.username}@{connection.host}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="h-px bg-gray-100 my-6"></div>

            <ConnectionForm onConnect={handleConnect} />

            <div className="mt-6 space-y-4">
              <SelectionInfo />
              <DragDropInfo />
              <PermissionsInfo />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div>
          {!activeConnection ? (
            <div className="flex flex-col items-center justify-center h-[500px]">
              <CircularAnimation size={48} />
              <h3 className="text-xl font-light tracking-tight mt-6">NO ACTIVE CONNECTION</h3>
              <p className="text-sm text-gray-600 mt-2">Connect to a server using SSH to browse and manage files</p>
            </div>
          ) : (
            <div>
              {/* Path and actions */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase text-gray-500">PATH:</span>
                    <Input
                      value={currentPath}
                      onChange={(e) => setCurrentPath(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs uppercase"
                      onClick={() => setView("browser")}
                    >
                      BROWSE
                    </Button>
                    {selectedFile && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs uppercase"
                          onClick={() => setView("preview")}
                        >
                          PREVIEW
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs uppercase"
                          onClick={() => setView("editor")}
                        >
                          EDIT
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                {view === "browser" && (
                  <FileBrowser
                    connection={activeConnection}
                    path={currentPath}
                    onPathChange={setCurrentPath}
                    onSelectFile={handleSelectFile}
                  />
                )}

                {view === "preview" && selectedFile && (
                  <FilePreview connection={activeConnection} filePath={selectedFile} />
                )}

                {view === "editor" && selectedFile && (
                  <FileEditor connection={activeConnection} filePath={selectedFile} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
