"use client"

import { Button } from "@/components/ui/button"
import { Trash2, X, Copy, MoveHorizontal, Download, Shield } from "lucide-react"

interface MultiSelectActionsProps {
  selectedCount: number
  onDelete: () => void
  onClear: () => void
  onPermissions: () => void
}

export function MultiSelectActions({ selectedCount, onDelete, onClear, onPermissions }: MultiSelectActionsProps) {
  return (
    <div className="bg-gray-50 p-2 border-b border-gray-200 flex justify-between items-center">
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium text-gray-700">{selectedCount} ITEMS SELECTED</span>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" className="h-8 text-xs uppercase" onClick={onClear}>
          <X className="w-3.5 h-3.5 mr-1" />
          Clear
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-xs uppercase">
          <Download className="w-3.5 h-3.5 mr-1" />
          Download
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-xs uppercase">
          <Copy className="w-3.5 h-3.5 mr-1" />
          Copy
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-xs uppercase">
          <MoveHorizontal className="w-3.5 h-3.5 mr-1" />
          Move
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-xs uppercase" onClick={onPermissions}>
          <Shield className="w-3.5 h-3.5 mr-1" />
          Permissions
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-xs uppercase text-red-600" onClick={onDelete}>
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  )
}
