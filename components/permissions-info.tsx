export function PermissionsInfo() {
  return (
    <div className="p-4 border border-dashed border-gray-200 rounded-lg">
      <div className="text-center">
        <h4 className="text-sm font-medium tracking-tight mb-2">UNIX PERMISSIONS</h4>
        <div className="text-xs text-gray-600 space-y-2">
          <p>Unix permissions control who can read, write, or execute files.</p>

          <div className="mt-2">
            <p className="font-medium">Symbolic format: rwxrwxrwx</p>
            <ul className="text-left mt-1 space-y-1">
              <li>• First triplet: Owner permissions</li>
              <li>• Second triplet: Group permissions</li>
              <li>• Third triplet: Others permissions</li>
            </ul>
          </div>

          <div className="mt-2">
            <p className="font-medium">Numeric format: 777</p>
            <ul className="text-left mt-1 space-y-1">
              <li>• 4 = Read permission</li>
              <li>• 2 = Write permission</li>
              <li>• 1 = Execute permission</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
