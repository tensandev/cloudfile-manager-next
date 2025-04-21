import type { FileItem } from "@/lib/types"

export function getMockFiles(path: string): FileItem[] {
  // Root directory
  if (path === "/") {
    return [
      {
        name: "home",
        type: "directory",
        size: 0,
        modified: "2023-04-15T10:30:00Z",
        permissions: "drwxr-xr-x",
      },
      {
        name: "var",
        type: "directory",
        size: 0,
        modified: "2023-04-10T08:15:00Z",
        permissions: "drwxr-xr-x",
      },
      {
        name: "etc",
        type: "directory",
        size: 0,
        modified: "2023-04-12T14:45:00Z",
        permissions: "drwxr-xr-x",
      },
      {
        name: "usr",
        type: "directory",
        size: 0,
        modified: "2023-04-08T11:20:00Z",
        permissions: "drwxr-xr-x",
      },
    ]
  }

  // Home directory
  if (path === "/home/") {
    return [
      {
        name: "user",
        type: "directory",
        size: 0,
        modified: "2023-04-15T10:30:00Z",
        permissions: "drwxr-xr-x",
      },
      {
        name: "README.txt",
        type: "file",
        size: 1024,
        modified: "2023-04-14T09:25:00Z",
        permissions: "-rw-r--r--",
      },
    ]
  }

  // User directory
  if (path === "/home/user/") {
    return [
      {
        name: "documents",
        type: "directory",
        size: 0,
        modified: "2023-04-15T10:30:00Z",
        permissions: "drwxr-xr-x",
      },
      {
        name: "images",
        type: "directory",
        size: 0,
        modified: "2023-04-13T16:40:00Z",
        permissions: "drwxr-xr-x",
      },
      {
        name: "projects",
        type: "directory",
        size: 0,
        modified: "2023-04-11T13:10:00Z",
        permissions: "drwxr-xr-x",
      },
      {
        name: "notes.txt",
        type: "file",
        size: 2048,
        modified: "2023-04-14T09:25:00Z",
        permissions: "-rw-r--r--",
      },
      {
        name: "config.json",
        type: "file",
        size: 512,
        modified: "2023-04-12T11:15:00Z",
        permissions: "-rw-r--r--",
      },
    ]
  }

  // Documents directory
  if (path === "/home/user/documents/") {
    return [
      {
        name: "report.pdf",
        type: "file",
        size: 1024 * 1024 * 2.5,
        modified: "2023-04-10T14:20:00Z",
        permissions: "-rw-r--r--",
      },
      {
        name: "presentation.pptx",
        type: "file",
        size: 1024 * 1024 * 5.2,
        modified: "2023-04-08T09:15:00Z",
        permissions: "-rw-r--r--",
      },
      {
        name: "budget.xlsx",
        type: "file",
        size: 1024 * 512,
        modified: "2023-04-12T16:30:00Z",
        permissions: "-rw-r--r--",
      },
      {
        name: "meeting-notes.md",
        type: "file",
        size: 1024 * 8,
        modified: "2023-04-14T11:45:00Z",
        permissions: "-rw-r--r--",
      },
    ]
  }

  // Images directory
  if (path === "/home/user/images/") {
    return [
      {
        name: "photo1.jpg",
        type: "file",
        size: 1024 * 1024 * 1.8,
        modified: "2023-04-05T10:20:00Z",
        permissions: "-rw-r--r--",
      },
      {
        name: "photo2.jpg",
        type: "file",
        size: 1024 * 1024 * 2.1,
        modified: "2023-04-06T14:30:00Z",
        permissions: "-rw-r--r--",
      },
      {
        name: "screenshot.png",
        type: "file",
        size: 1024 * 512,
        modified: "2023-04-10T09:15:00Z",
        permissions: "-rw-r--r--",
      },
      {
        name: "logo.svg",
        type: "file",
        size: 1024 * 5,
        modified: "2023-04-12T11:40:00Z",
        permissions: "-rw-r--r--",
      },
    ]
  }

  // Projects directory
  if (path === "/home/user/projects/") {
    return [
      {
        name: "website",
        type: "directory",
        size: 0,
        modified: "2023-04-08T15:20:00Z",
        permissions: "drwxr-xr-x",
      },
      {
        name: "app",
        type: "directory",
        size: 0,
        modified: "2023-04-10T11:30:00Z",
        permissions: "drwxr-xr-x",
      },
      {
        name: "README.md",
        type: "file",
        size: 1024 * 3,
        modified: "2023-04-12T09:45:00Z",
        permissions: "-rw-r--r--",
      },
      {
        name: "package.json",
        type: "file",
        size: 1024 * 2,
        modified: "2023-04-11T14:25:00Z",
        permissions: "-rw-r--r--",
      },
    ]
  }

  // Website project directory
  if (path === "/home/user/projects/website/") {
    return [
      {
        name: "index.html",
        type: "file",
        size: 1024 * 5,
        modified: "2023-04-07T10:15:00Z",
        permissions: "-rw-r--r--",
      },
      {
        name: "styles.css",
        type: "file",
        size: 1024 * 8,
        modified: "2023-04-08T14:30:00Z",
        permissions: "-rw-r--r--",
      },
      {
        name: "script.js",
        type: "file",
        size: 1024 * 10,
        modified: "2023-04-09T11:45:00Z",
        permissions: "-rw-r--r--",
      },
      {
        name: "assets",
        type: "directory",
        size: 0,
        modified: "2023-04-06T09:20:00Z",
        permissions: "drwxr-xr-x",
      },
    ]
  }

  // App project directory
  if (path === "/home/user/projects/app/") {
    return [
      {
        name: "src",
        type: "directory",
        size: 0,
        modified: "2023-04-09T15:30:00Z",
        permissions: "drwxr-xr-x",
      },
      {
        name: "public",
        type: "directory",
        size: 0,
        modified: "2023-04-08T11:20:00Z",
        permissions: "drwxr-xr-x",
      },
      {
        name: "package.json",
        type: "file",
        size: 1024 * 2,
        modified: "2023-04-10T09:45:00Z",
        permissions: "-rw-r--r--",
      },
      {
        name: "tsconfig.json",
        type: "file",
        size: 1024 * 1,
        modified: "2023-04-09T14:15:00Z",
        permissions: "-rw-r--r--",
      },
    ]
  }

  // Default: empty directory
  return []
}
