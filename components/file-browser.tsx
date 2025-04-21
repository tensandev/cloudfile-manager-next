"use client"

import { Label } from "@/components/ui/label"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  FileIcon,
  FolderIcon,
  ChevronUp,
  MoreHorizontal,
  Upload,
  Download,
  Trash2,
  Edit,
  Plus,
  Search,
  MoveHorizontal,
  Copy,
  Shield,
} from "lucide-react"
import type { SSHConnection, FileItem } from "@/lib/types"
import { getMockFiles } from "@/lib/mock-data"
import { CircularAnimation } from "@/components/circular-animation"
import { cn } from "@/lib/utils"
import { MultiSelectActions } from "@/components/multi-select-actions"
import { PermissionsEditor } from "@/components/permissions-editor"

interface FileBrowserProps {
  connection: SSHConnection
  path: string
  onPathChange: (path: string) => void
  onSelectFile: (path: string) => void
}

export function FileBrowser({ connection, path, onPathChange, onSelectFile }: FileBrowserProps) {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [lastSelectedItem, setLastSelectedItem] = useState<string | null>(null)
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [itemToRename, setItemToRename] = useState<FileItem | null>(null)
  const [newName, setNewName] = useState("")
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null>(null)
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false)
  const [itemsToChangePermissions, setItemsToChangePermissions] = useState<FileItem[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // In a real app, we would fetch the files from the SSH connection
    // For now, we'll use mock data
    setLoading(true)

    setTimeout(() => {
      setFiles(getMockFiles(path))
      setLoading(false)
    }, 500)
  }, [path, connection])

  const handleNavigate = (newPath: string) => {
    setSelectedItems([])
    setLastSelectedItem(null)
    onPathChange(newPath)
  }

  const handleParentDirectory = () => {
    if (path === "/") return

    const parts = path.split("/").filter(Boolean)
    parts.pop()
    const newPath = parts.length === 0 ? "/" : `/${parts.join("/")}/`

    handleNavigate(newPath)
  }

  const handleSelectItem = (item: FileItem, e: React.MouseEvent) => {
    // If it's a double click, navigate or open the file
    if (e.detail === 2) {
      if (item.type === "directory") {
        handleNavigate(`${path}${item.name}/`)
      } else {
        onSelectFile(`${path}${item.name}`)
      }
      return
    }

    const itemPath = `${path}${item.name}`

    // Handle selection with modifier keys
    if (e.ctrlKey || e.metaKey) {
      // Ctrl/Cmd+click: Toggle selection of the clicked item
      setSelectedItems((prev) => {
        if (prev.includes(itemPath)) {
          return prev.filter((p) => p !== itemPath)
        } else {
          return [...prev, itemPath]
        }
      })
      setLastSelectedItem(itemPath)
    } else if (e.shiftKey && lastSelectedItem) {
      // Shift+click: Select range of items
      const filteredFiles = searchQuery
        ? files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : files

      const fileNames = filteredFiles.map((file) => `${path}${file.name}`)
      const startIndex = fileNames.indexOf(lastSelectedItem)
      const endIndex = fileNames.indexOf(itemPath)

      if (startIndex !== -1 && endIndex !== -1) {
        const start = Math.min(startIndex, endIndex)
        const end = Math.max(startIndex, endIndex)
        const rangeSelection = fileNames.slice(start, end + 1)

        // Merge with existing selection outside the range
        const existingSelection = selectedItems.filter((item) => !fileNames.includes(item))
        setSelectedItems([...existingSelection, ...rangeSelection])
      }
    } else {
      // Regular click: Select only the clicked item
      setSelectedItems([itemPath])
      setLastSelectedItem(itemPath)
    }
  }

  const handleSelectAll = () => {
    const filteredFiles = searchQuery
      ? files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : files

    if (selectedItems.length === filteredFiles.length) {
      // If all are selected, deselect all
      setSelectedItems([])
      setLastSelectedItem(null)
    } else {
      // Otherwise, select all
      setSelectedItems(filteredFiles.map((file) => `${path}${file.name}`))
      setLastSelectedItem(filteredFiles.length > 0 ? `${path}${filteredFiles[0].name}` : null)
    }
  }

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return

    // In a real app, we would create the folder via SSH
    // For now, we'll simulate it
    const newFolder: FileItem = {
      name: newFolderName,
      type: "directory",
      size: 0,
      modified: new Date().toISOString(),
      permissions: "drwxr-xr-x",
    }

    setFiles((prev) => [...prev, newFolder])
    setNewFolderName("")
    setShowNewFolderDialog(false)
  }

  const handleRename = () => {
    if (!itemToRename || !newName.trim()) return

    // In a real app, we would rename the item via SSH
    // For now, we'll simulate it
    setFiles((prev) => prev.map((item) => (item.name === itemToRename.name ? { ...item, name: newName } : item)))

    setItemToRename(null)
    setNewName("")
    setShowRenameDialog(false)
  }

  const handleDelete = (items: string[]) => {
    // In a real app, we would delete the items via SSH
    // For now, we'll simulate it
    const itemNames = items.map((item) => item.split("/").pop() || "")
    setFiles((prev) => prev.filter((f) => !itemNames.includes(f.name)))
    setSelectedItems([])
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // In a real app, we would upload the files via SSH
    // For now, we'll simulate it by adding them to the file list
    const newFiles: FileItem[] = Array.from(files).map((file) => ({
      name: file.name,
      type: "file",
      size: file.size,
      modified: new Date().toISOString(),
      permissions: "-rw-r--r--",
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Drag and drop handlers for file upload
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(true)
  }

  const handleDragLeave = () => {
    setIsDraggingOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(false)

    // Handle files dropped from the user's system
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles: FileItem[] = Array.from(e.dataTransfer.files).map((file) => ({
        name: file.name,
        type: "file",
        size: file.size,
        modified: new Date().toISOString(),
        permissions: "-rw-r--r--",
      }))

      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  // Drag and drop handlers for file organization
  const handleItemDragStart = (e: React.DragEvent) => {
    // If dragging a selected item, drag all selected items
    // Otherwise, just drag the current item
    const itemName = e.currentTarget.getAttribute("data-item-name")
    if (!itemName) return

    const itemPath = `${path}${itemName}`

    if (!selectedItems.includes(itemPath)) {
      setSelectedItems([itemPath])
    }

    // Store the dragged items in the dataTransfer
    const draggedItems = selectedItems.length > 0 ? selectedItems : [itemPath]
    e.dataTransfer.setData("text/plain", JSON.stringify(draggedItems))

    setDraggedItem(itemPath)

    // Set a custom drag image if multiple items are selected
    if (selectedItems.length > 1) {
      const dragElement = document.createElement("div")
      dragElement.className = "bg-white p-2 rounded shadow-sm border border-gray-200"
      dragElement.textContent = `${selectedItems.length} items`
      document.body.appendChild(dragElement)
      e.dataTransfer.setDragImage(dragElement, 0, 0)
      setTimeout(() => {
        document.body.removeChild(dragElement)
      }, 0)
    }
  }

  const handleItemDragOver = (e: React.DragEvent, targetItem: FileItem) => {
    e.preventDefault()
    if (targetItem.type === "directory" && draggedItem && !selectedItems.includes(`${path}${targetItem.name}`)) {
      setDropTarget(`${path}${targetItem.name}`)
    }
  }

  const handleItemDragLeave = () => {
    setDropTarget(null)
  }

  const handleItemDrop = (e: React.DragEvent, targetItem: FileItem) => {
    e.preventDefault()
    e.stopPropagation()
    setDropTarget(null)

    if (targetItem.type !== "directory") return

    try {
      // Get the dragged items from the dataTransfer
      const draggedItems = JSON.parse(e.dataTransfer.getData("text/plain")) as string[]

      // Get the file names from the dragged item paths
      const fileNames = draggedItems.map((item) => item.split("/").pop() || "")

      // In a real app, we would move the files via SSH
      // For now, we'll simulate it by removing them from the current directory
      setFiles((prev) => prev.filter((f) => !fileNames.includes(f.name)))

      // Show a success message or notification
      console.log(`Moved ${fileNames.join(", ")} to ${targetItem.name}/`)

      // Clear selection after move
      setSelectedItems([])
      setLastSelectedItem(null)
    } catch (error) {
      console.error("Error parsing dragged items:", error)
    }

    setDraggedItem(null)
  }

  // Handle keyboard events for the file browser
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Delete key to delete selected items
    if (e.key === "Delete" && selectedItems.length > 0) {
      handleDelete(selectedItems)
    }

    // Ctrl+A to select all
    if ((e.ctrlKey || e.metaKey) && e.key === "a") {
      e.preventDefault()
      handleSelectAll()
    }

    // Escape to clear selection
    if (e.key === "Escape") {
      setSelectedItems([])
      setLastSelectedItem(null)
    }
  }

  const handleOpenPermissionsDialog = (items: string[]) => {
    // Get the file items for the selected paths
    const fileItems = files.filter((file) => items.includes(`${path}${file.name}`))
    if (fileItems.length === 0) return

    setItemsToChangePermissions(fileItems)
    setShowPermissionsDialog(true)
  }

  const handleUpdatePermissions = (newPermissions: string) => {
    // In a real app, we would update the permissions via SSH
    // For now, we'll simulate it
    setFiles((prev) =>
      prev.map((file) => {
        if (itemsToChangePermissions.some((item) => item.name === file.name)) {
          return { ...file, permissions: newPermissions }
        }
        return file
      }),
    )

    setShowPermissionsDialog(false)
    setItemsToChangePermissions([])
  }

  const filteredFiles = searchQuery
    ? files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : files

  return (
    <div
      className={cn("h-[600px] flex flex-col", isDraggingOver && "bg-gray-50 border-2 border-dashed border-gray-300")}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onKeyDown={handleKeyDown}
      tabIndex={0} // Make the div focusable for keyboard events
    >
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs uppercase"
            onClick={handleParentDirectory}
            disabled={path === "/"}
          >
            <ChevronUp className="w-4 h-4 mr-1" />
            UP
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-xs uppercase"
            onClick={() => setShowNewFolderDialog(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            NEW FOLDER
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-xs uppercase"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-1" />
            UPLOAD
          </Button>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} multiple />
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-sm w-[200px]"
          />
        </div>
      </div>

      {/* Multi-select actions */}
      {selectedItems.length > 0 && (
        <MultiSelectActions
          selectedCount={selectedItems.length}
          onDelete={() => handleDelete(selectedItems)}
          onClear={() => {
            setSelectedItems([])
            setLastSelectedItem(null)
          }}
          onPermissions={() => handleOpenPermissionsDialog(selectedItems)}
        />
      )}

      {/* File list */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center">
              <CircularAnimation size={32} />
              <p className="text-sm text-gray-600 mt-4">LOADING FILES...</p>
            </div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-sm text-gray-600">NO FILES FOUND</p>
              <p className="text-xs text-gray-500 mt-1">
                {searchQuery ? "Try a different search term" : "This directory is empty"}
              </p>
              {isDraggingOver && (
                <div className="mt-4 text-sm text-gray-600">
                  <Upload className="w-6 h-6 mx-auto mb-2" />
                  DROP FILES HERE TO UPLOAD
                </div>
              )}
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px] text-xs uppercase">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center cursor-pointer"
                      onClick={() => handleSelectAll()}
                    >
                      {selectedItems.length === filteredFiles.length && filteredFiles.length > 0 && (
                        <div className="w-2 h-2 bg-black rounded-sm"></div>
                      )}
                    </div>
                    <span>Name</span>
                  </div>
                </TableHead>
                <TableHead className="text-xs uppercase">Size</TableHead>
                <TableHead className="text-xs uppercase">Modified</TableHead>
                <TableHead className="text-xs uppercase">Permissions</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => {
                const itemPath = `${path}${file.name}`
                const isSelected = selectedItems.includes(itemPath)

                return (
                  <TableRow
                    key={file.name}
                    className={cn(
                      "cursor-pointer",
                      isSelected ? "bg-gray-100" : "",
                      dropTarget === itemPath ? "bg-gray-100" : "",
                    )}
                    onClick={(e) => handleSelectItem(file, e)}
                    draggable={true}
                    onDragStart={handleItemDragStart}
                    onDragOver={(e) => handleItemDragOver(e, file)}
                    onDragLeave={handleItemDragLeave}
                    onDrop={(e) => handleItemDrop(e, file)}
                    data-item-name={file.name}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectItem(file, {
                              ...e,
                              ctrlKey: true, // Simulate Ctrl+click behavior
                              detail: 1,
                            } as React.MouseEvent)
                          }}
                        >
                          {isSelected && <div className="w-2 h-2 bg-black rounded-sm"></div>}
                        </div>
                        {file.type === "directory" ? (
                          <FolderIcon className="w-4 h-4 text-gray-500" />
                        ) : (
                          <FileIcon className="w-4 h-4 text-gray-500" />
                        )}
                        <span className="text-sm">{file.name}</span>
                        {draggedItem === itemPath && <span className="text-xs text-gray-500 ml-2">(dragging)</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {file.type === "directory" ? "—" : formatFileSize(file.size)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{formatDate(file.modified)}</TableCell>
                    <TableCell
                      className="text-sm text-gray-600 font-mono"
                      title="Click to edit permissions"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenPermissionsDialog([itemPath])
                      }}
                    >
                      <span className="cursor-pointer hover:underline">{file.permissions}</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {file.type !== "directory" && (
                            <DropdownMenuItem className="text-xs uppercase">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-xs uppercase"
                            onClick={(e) => {
                              e.stopPropagation()
                              setItemToRename(file)
                              setNewName(file.name)
                              setShowRenameDialog(true)
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs uppercase">
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs uppercase">
                            <MoveHorizontal className="w-4 h-4 mr-2" />
                            Move
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-xs uppercase"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenPermissionsDialog([itemPath])
                            }}
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-xs uppercase text-red-600"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete([itemPath])
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Drag overlay when dragging over the file browser */}
      {isDraggingOver && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <p className="text-lg font-light tracking-tight">DROP FILES TO UPLOAD</p>
          </div>
        </div>
      )}

      {/* New folder dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-light tracking-tight">CREATE NEW FOLDER</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="folderName" className="text-xs uppercase">
              Folder Name
            </Label>
            <Input
              id="folderName"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="mt-2"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderDialog(false)} className="text-xs uppercase">
              CANCEL
            </Button>
            <Button onClick={handleCreateFolder} className="text-xs uppercase">
              CREATE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-light tracking-tight">RENAME ITEM</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="newName" className="text-xs uppercase">
              New Name
            </Label>
            <Input
              id="newName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mt-2"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)} className="text-xs uppercase">
              CANCEL
            </Button>
            <Button onClick={handleRename} className="text-xs uppercase">
              RENAME
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions dialog */}
      <Dialog open={showPermissionsDialog} onOpenChange={setShowPermissionsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-light tracking-tight">
              {itemsToChangePermissions.length === 1
                ? `EDIT PERMISSIONS: ${itemsToChangePermissions[0]?.name}`
                : `EDIT PERMISSIONS: ${itemsToChangePermissions.length} ITEMS`}
            </DialogTitle>
          </DialogHeader>

          {itemsToChangePermissions.length > 0 && (
            <PermissionsEditor
              initialPermissions={itemsToChangePermissions[0]?.permissions || "-rw-r--r--"}
              onUpdate={handleUpdatePermissions}
              onCancel={() => setShowPermissionsDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"

  const units = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))

  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString() + " " + date.toLocaleTimeString()
}
