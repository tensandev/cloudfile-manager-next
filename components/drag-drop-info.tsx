import { Upload } from "lucide-react"

export function DragDropInfo() {
  return (
    <div className="mt-8 p-6 border border-dashed border-gray-200 rounded-lg max-w-md">
      <div className="text-center">
        <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
        <h4 className="text-lg font-light tracking-tight mb-2">DRAG & DROP</h4>
        <p className="text-sm text-gray-600">Drag and drop files to upload them to the server once connected.</p>
        <p className="text-sm text-gray-600 mt-2">You can also drag files between folders to organize them.</p>
      </div>
    </div>
  )
}
