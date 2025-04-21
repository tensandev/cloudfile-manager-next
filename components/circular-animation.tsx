"use client"

import { useEffect, useRef } from "react"

interface CircularAnimationProps {
  size?: number
}

export function CircularAnimation({ size = 40 }: CircularAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const canvasSize = size * dpr

    canvas.width = canvasSize
    canvas.height = canvasSize

    let rotation = 0

    const draw = () => {
      rotation += 0.005

      ctx.clearRect(0, 0, canvasSize, canvasSize)

      // Draw outer circle
      ctx.beginPath()
      ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2 - 2, 0, Math.PI * 2)
      ctx.strokeStyle = "#e0e0e0"
      ctx.lineWidth = 1 * dpr
      ctx.stroke()

      // Draw rotating arc
      ctx.beginPath()
      ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2 - 2, rotation, rotation + Math.PI * 0.75)
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 2 * dpr
      ctx.stroke()

      requestAnimationFrame(draw)
    }

    const animationId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [size])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ width: `${size}px`, height: `${size}px` }}
      className="rounded-full"
    />
  )
}
