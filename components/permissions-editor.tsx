"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield } from "lucide-react"

interface PermissionsEditorProps {
  initialPermissions: string
  onUpdate: (permissions: string) => void
  onCancel: () => void
}

export function PermissionsEditor({ initialPermissions, onUpdate, onCancel }: PermissionsEditorProps) {
  const [permissions, setPermissions] = useState({
    owner: { read: false, write: false, execute: false },
    group: { read: false, write: false, execute: false },
    others: { read: false, write: false, execute: false },
    special: { setuid: false, setgid: false, sticky: false },
  })
  const [numericMode, setNumericMode] = useState("000")
  const [symbolicMode, setSymbolicMode] = useState("---------")
  const [activeTab, setActiveTab] = useState("visual")

  // Parse the initial permissions string
  useEffect(() => {
    if (!initialPermissions) return

    // Parse symbolic format (e.g., "drwxr-xr-x")
    const isDirectory = initialPermissions.charAt(0) === "d"
    const owner = {
      read: initialPermissions.charAt(1) === "r",
      write: initialPermissions.charAt(2) === "w",
      execute: initialPermissions.charAt(3) === "x",
    }
    const group = {
      read: initialPermissions.charAt(4) === "r",
      write: initialPermissions.charAt(5) === "w",
      execute: initialPermissions.charAt(6) === "x",
    }
    const others = {
      read: initialPermissions.charAt(7) === "r",
      write: initialPermissions.charAt(8) === "w",
      execute: initialPermissions.charAt(9) === "x",
    }

    // Parse special bits
    const special = {
      setuid: initialPermissions.charAt(3) === "s" || initialPermissions.charAt(3) === "S",
      setgid: initialPermissions.charAt(6) === "s" || initialPermissions.charAt(6) === "S",
      sticky: initialPermissions.charAt(9) === "t" || initialPermissions.charAt(9) === "T",
    }

    setPermissions({ owner, group, others, special })

    // Calculate numeric mode
    const ownerNum = (owner.read ? 4 : 0) + (owner.write ? 2 : 0) + (owner.execute ? 1 : 0)
    const groupNum = (group.read ? 4 : 0) + (group.write ? 2 : 0) + (group.execute ? 1 : 0)
    const othersNum = (others.read ? 4 : 0) + (others.write ? 2 : 0) + (others.execute ? 1 : 0)
    const specialNum = (special.setuid ? 4 : 0) + (special.setgid ? 2 : 0) + (special.sticky ? 1 : 0)

    const numeric =
      specialNum > 0 ? `${specialNum}${ownerNum}${groupNum}${othersNum}` : `${ownerNum}${groupNum}${othersNum}`
    setNumericMode(numeric)

    // Generate symbolic representation
    const fileType = isDirectory ? "d" : "-"
    const ownerSym = `${owner.read ? "r" : "-"}${owner.write ? "w" : "-"}${owner.execute ? (special.setuid ? "s" : "x") : special.setuid ? "S" : "-"}`
    const groupSym = `${group.read ? "r" : "-"}${group.write ? "w" : "-"}${group.execute ? (special.setgid ? "s" : "x") : special.setgid ? "S" : "-"}`
    const othersSym = `${others.read ? "r" : "-"}${others.write ? "w" : "-"}${others.execute ? (special.sticky ? "t" : "x") : special.sticky ? "T" : "-"}`

    setSymbolicMode(`${fileType}${ownerSym}${groupSym}${othersSym}`)
  }, [initialPermissions])

  // Update symbolic and numeric modes when permissions change
  useEffect(() => {
    const { owner, group, others, special } = permissions

    // Calculate numeric mode
    const ownerNum = (owner.read ? 4 : 0) + (owner.write ? 2 : 0) + (owner.execute ? 1 : 0)
    const groupNum = (group.read ? 4 : 0) + (group.write ? 2 : 0) + (group.execute ? 1 : 0)
    const othersNum = (others.read ? 4 : 0) + (others.write ? 2 : 0) + (others.execute ? 1 : 0)
    const specialNum = (special.setuid ? 4 : 0) + (special.setgid ? 2 : 0) + (special.sticky ? 1 : 0)

    const numeric =
      specialNum > 0 ? `${specialNum}${ownerNum}${groupNum}${othersNum}` : `${ownerNum}${groupNum}${othersNum}`
    setNumericMode(numeric)

    // Determine if it's a directory
    const isDirectory = initialPermissions.charAt(0) === "d"
    const fileType = isDirectory ? "d" : "-"

    // Generate symbolic representation
    const ownerSym = `${owner.read ? "r" : "-"}${owner.write ? "w" : "-"}${owner.execute ? (special.setuid ? "s" : "x") : special.setuid ? "S" : "-"}`
    const groupSym = `${group.read ? "r" : "-"}${group.write ? "w" : "-"}${group.execute ? (special.setgid ? "s" : "x") : special.setgid ? "S" : "-"}`
    const othersSym = `${others.read ? "r" : "-"}${others.write ? "w" : "-"}${others.execute ? (special.sticky ? "t" : "x") : special.sticky ? "T" : "-"}`

    setSymbolicMode(`${fileType}${ownerSym}${groupSym}${othersSym}`)
  }, [permissions, initialPermissions])

  const handlePermissionChange = (
    category: "owner" | "group" | "others",
    permission: "read" | "write" | "execute",
    checked: boolean,
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [permission]: checked,
      },
    }))
  }

  const handleSpecialBitChange = (bit: "setuid" | "setgid" | "sticky", checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      special: {
        ...prev.special,
        [bit]: checked,
      },
    }))
  }

  const handleNumericChange = (value: string) => {
    // Ensure the input is a valid octal number
    if (!/^[0-7]{3,4}$/.test(value)) {
      return
    }

    setNumericMode(value)

    // Parse the numeric mode
    const digits = value.padStart(4, "0").split("").map(Number)
    const specialNum = digits.length === 4 ? digits[0] : 0
    const ownerNum = digits.length === 4 ? digits[1] : digits[0]
    const groupNum = digits.length === 4 ? digits[2] : digits[1]
    const othersNum = digits.length === 4 ? digits[3] : digits[2]

    // Update permissions
    setPermissions({
      owner: {
        read: (ownerNum & 4) === 4,
        write: (ownerNum & 2) === 2,
        execute: (ownerNum & 1) === 1,
      },
      group: {
        read: (groupNum & 4) === 4,
        write: (groupNum & 2) === 2,
        execute: (groupNum & 1) === 1,
      },
      others: {
        read: (othersNum & 4) === 4,
        write: (othersNum & 2) === 2,
        execute: (othersNum & 1) === 1,
      },
      special: {
        setuid: (specialNum & 4) === 4,
        setgid: (specialNum & 2) === 2,
        sticky: (specialNum & 1) === 1,
      },
    })
  }

  const handleSave = () => {
    onUpdate(symbolicMode)
  }

  return (
    <div className="py-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="visual" className="text-xs uppercase">
            Visual Editor
          </TabsTrigger>
          <TabsTrigger value="numeric" className="text-xs uppercase">
            Numeric Mode
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="mt-4">
          <div className="space-y-6">
            {/* Current permissions display */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs uppercase text-gray-500">Current Permissions</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{symbolicMode}</code>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{numericMode}</code>
                </div>
              </div>
            </div>

            {/* Permission checkboxes */}
            <div className="space-y-4">
              {/* Owner permissions */}
              <div>
                <Label className="text-xs uppercase text-gray-500">Owner</Label>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="owner-read"
                      checked={permissions.owner.read}
                      onCheckedChange={(checked) => handlePermissionChange("owner", "read", checked === true)}
                    />
                    <Label htmlFor="owner-read" className="text-sm">
                      Read
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="owner-write"
                      checked={permissions.owner.write}
                      onCheckedChange={(checked) => handlePermissionChange("owner", "write", checked === true)}
                    />
                    <Label htmlFor="owner-write" className="text-sm">
                      Write
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="owner-execute"
                      checked={permissions.owner.execute}
                      onCheckedChange={(checked) => handlePermissionChange("owner", "execute", checked === true)}
                    />
                    <Label htmlFor="owner-execute" className="text-sm">
                      Execute
                    </Label>
                  </div>
                </div>
              </div>

              {/* Group permissions */}
              <div>
                <Label className="text-xs uppercase text-gray-500">Group</Label>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="group-read"
                      checked={permissions.group.read}
                      onCheckedChange={(checked) => handlePermissionChange("group", "read", checked === true)}
                    />
                    <Label htmlFor="group-read" className="text-sm">
                      Read
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="group-write"
                      checked={permissions.group.write}
                      onCheckedChange={(checked) => handlePermissionChange("group", "write", checked === true)}
                    />
                    <Label htmlFor="group-write" className="text-sm">
                      Write
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="group-execute"
                      checked={permissions.group.execute}
                      onCheckedChange={(checked) => handlePermissionChange("group", "execute", checked === true)}
                    />
                    <Label htmlFor="group-execute" className="text-sm">
                      Execute
                    </Label>
                  </div>
                </div>
              </div>

              {/* Others permissions */}
              <div>
                <Label className="text-xs uppercase text-gray-500">Others</Label>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="others-read"
                      checked={permissions.others.read}
                      onCheckedChange={(checked) => handlePermissionChange("others", "read", checked === true)}
                    />
                    <Label htmlFor="others-read" className="text-sm">
                      Read
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="others-write"
                      checked={permissions.others.write}
                      onCheckedChange={(checked) => handlePermissionChange("others", "write", checked === true)}
                    />
                    <Label htmlFor="others-write" className="text-sm">
                      Write
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="others-execute"
                      checked={permissions.others.execute}
                      onCheckedChange={(checked) => handlePermissionChange("others", "execute", checked === true)}
                    />
                    <Label htmlFor="others-execute" className="text-sm">
                      Execute
                    </Label>
                  </div>
                </div>
              </div>

              {/* Special permissions */}
              <div>
                <Label className="text-xs uppercase text-gray-500">Special Permissions</Label>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="setuid"
                      checked={permissions.special.setuid}
                      onCheckedChange={(checked) => handleSpecialBitChange("setuid", checked === true)}
                    />
                    <Label htmlFor="setuid" className="text-sm">
                      SetUID
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="setgid"
                      checked={permissions.special.setgid}
                      onCheckedChange={(checked) => handleSpecialBitChange("setgid", checked === true)}
                    />
                    <Label htmlFor="setgid" className="text-sm">
                      SetGID
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sticky"
                      checked={permissions.special.sticky}
                      onCheckedChange={(checked) => handleSpecialBitChange("sticky", checked === true)}
                    />
                    <Label htmlFor="sticky" className="text-sm">
                      Sticky
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="numeric" className="mt-4">
          <div className="space-y-6">
            <div>
              <Label htmlFor="numeric-mode" className="text-xs uppercase text-gray-500">
                Numeric Mode (Octal)
              </Label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="numeric-mode"
                  type="text"
                  value={numericMode}
                  onChange={(e) => handleNumericChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                  placeholder="e.g. 755"
                  maxLength={4}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Enter a 3 or 4 digit octal number (e.g., 755 or 4755)</p>
            </div>

            <div>
              <Label className="text-xs uppercase text-gray-500">Symbolic Representation</Label>
              <div className="mt-1 flex items-center gap-2">
                <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono w-full">{symbolicMode}</code>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500">Common Permission Patterns:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs justify-start"
                  onClick={() => handleNumericChange("755")}
                >
                  <code className="mr-2">755</code> <span className="text-gray-500">rwxr-xr-x</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs justify-start"
                  onClick={() => handleNumericChange("644")}
                >
                  <code className="mr-2">644</code> <span className="text-gray-500">rw-r--r--</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs justify-start"
                  onClick={() => handleNumericChange("777")}
                >
                  <code className="mr-2">777</code> <span className="text-gray-500">rwxrwxrwx</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs justify-start"
                  onClick={() => handleNumericChange("700")}
                >
                  <code className="mr-2">700</code> <span className="text-gray-500">rwx------</span>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onCancel} className="text-xs uppercase">
          CANCEL
        </Button>
        <Button onClick={handleSave} className="text-xs uppercase">
          APPLY CHANGES
        </Button>
      </div>
    </div>
  )
}
