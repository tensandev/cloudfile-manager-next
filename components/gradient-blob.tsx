"use client"

import { useEffect, useRef } from "react"

export function GradientBlob() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 400
    canvas.height = 400

    let time = 0

    const animate = () => {
      time += 0.005

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create gradient
      const gradient = ctx.createRadialGradient(200 + Math.sin(time) * 20, 200 + Math.cos(time) * 20, 0, 200, 200, 200)

      gradient.addColorStop(0, "rgba(200, 200, 200, 0.8)")
      gradient.addColorStop(0.5, "rgba(220, 220, 220, 0.3)")
      gradient.addColorStop(1, "rgba(240, 240, 240, 0)")

      ctx.fillStyle = gradient

      // Draw blob
      ctx.beginPath()

      const points = 8
      const radius = 150

      for (let i = 0; i < points * 2; i++) {
        const angle = (i * Math.PI) / points
        const x = 200 + Math.cos(angle) * (radius + Math.sin(time * 2 + i) * 20)
        const y = 200 + Math.sin(angle) * (radius + Math.cos(time * 2 + i) * 20)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.closePath()
      ctx.fill()

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-[400px] h-[400px]" />
}
