"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

type BrandLogoProps = {
  width: number
  height: number
  alt?: string
  className?: string
  priority?: boolean
}

export default function BrandLogo({
  width,
  height,
  alt = "Cerevo Logo",
  className,
  priority = false,
}: BrandLogoProps) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const syncTheme = () => {
      const darkEnabled =
        document.documentElement.classList.contains("dark") ||
        localStorage.getItem("darkMode") === "true"
      setIsDark(darkEnabled)
    }

    syncTheme()

    const observer = new MutationObserver(syncTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    window.addEventListener("storage", syncTheme)

    return () => {
      observer.disconnect()
      window.removeEventListener("storage", syncTheme)
    }
  }, [])

  return (
    <Image
      src={isDark ? "/logo3-dark.png" : "/logo3.png"}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={cn(className)}
    />
  )
}
