export interface SSHConnection {
  id: string
  name: string
  host: string
  port: number
  username: string
  // We don't store passwords or private keys in the client
  // They would be handled securely in a real application
}

export interface FileItem {
  name: string
  type: "file" | "directory"
  size: number
  modified: string
  permissions: string
}
