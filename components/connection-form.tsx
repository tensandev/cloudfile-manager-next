"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { SSHConnection } from "@/lib/types"
import { generateId } from "@/lib/utils"

interface ConnectionFormProps {
  onConnect: (connection: SSHConnection) => void
}

export function ConnectionForm({ onConnect }: ConnectionFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    host: "",
    port: "22",
    username: "",
    password: "",
    usePrivateKey: false,
    privateKey: "",
    saveConnection: true,
  })

  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsConnecting(true)

    // Validate form
    if (!formData.name || !formData.host || !formData.username) {
      setError("Please fill in all required fields")
      setIsConnecting(false)
      return
    }

    if (!formData.password && !formData.privateKey && formData.usePrivateKey) {
      setError("Please provide authentication credentials")
      setIsConnecting(false)
      return
    }

    // In a real app, we would establish the SSH connection here
    // For now, we'll simulate a successful connection
    setTimeout(() => {
      const newConnection: SSHConnection = {
        id: generateId(),
        name: formData.name,
        host: formData.host,
        port: Number.parseInt(formData.port),
        username: formData.username,
        // In a real app, we would handle credentials securely
      }

      onConnect(newConnection)

      // Reset form if not saving
      if (!formData.saveConnection) {
        setFormData({
          name: "",
          host: "",
          port: "22",
          username: "",
          password: "",
          usePrivateKey: false,
          privateKey: "",
          saveConnection: true,
        })
      }

      setIsConnecting(false)
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">NEW CONNECTION</h3>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-xs uppercase">
          Connection Name
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="My Server"
          className="h-8 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="host" className="text-xs uppercase">
            Host
          </Label>
          <Input
            id="host"
            name="host"
            value={formData.host}
            onChange={handleChange}
            placeholder="example.com"
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="port" className="text-xs uppercase">
            Port
          </Label>
          <Input
            id="port"
            name="port"
            value={formData.port}
            onChange={handleChange}
            placeholder="22"
            className="h-8 text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username" className="text-xs uppercase">
          Username
        </Label>
        <Input
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="user"
          className="h-8 text-sm"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="usePrivateKey"
          name="usePrivateKey"
          checked={formData.usePrivateKey}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, usePrivateKey: checked === true }))}
        />
        <Label htmlFor="usePrivateKey" className="text-xs uppercase">
          Use Private Key
        </Label>
      </div>

      {formData.usePrivateKey ? (
        <div className="space-y-2">
          <Label htmlFor="privateKey" className="text-xs uppercase">
            Private Key
          </Label>
          <Input
            id="privateKey"
            name="privateKey"
            value={formData.privateKey}
            onChange={handleChange}
            placeholder="Paste your private key or select a file"
            className="h-8 text-sm"
          />
          <div className="flex justify-end">
            <Button type="button" variant="outline" size="sm" className="text-xs uppercase mt-1">
              SELECT FILE
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs uppercase">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="h-8 text-sm"
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="saveConnection"
          name="saveConnection"
          checked={formData.saveConnection}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, saveConnection: checked === true }))}
        />
        <Label htmlFor="saveConnection" className="text-xs uppercase">
          Save Connection
        </Label>
      </div>

      {error && <div className="text-xs text-red-500">{error}</div>}

      <Button type="submit" className="w-full text-xs uppercase" disabled={isConnecting}>
        {isConnecting ? "CONNECTING..." : "CONNECT"}
      </Button>
    </form>
  )
}
