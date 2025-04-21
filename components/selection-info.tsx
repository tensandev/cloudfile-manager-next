export function SelectionInfo() {
  return (
    <div className="mb-4 p-4 border border-dashed border-gray-200 rounded-lg">
      <div className="text-center">
        <h4 className="text-sm font-medium tracking-tight mb-2">MULTI-SELECT</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Click to select a single item</li>
          <li>• Ctrl/Cmd+Click to toggle selection</li>
          <li>• Shift+Click to select a range</li>
          <li>• Press Delete to remove selected items</li>
          <li>• Ctrl/Cmd+A to select all items</li>
        </ul>
      </div>
    </div>
  )
}
