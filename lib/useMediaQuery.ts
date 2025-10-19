"use client"

import { useEffect, useState } from "react"

/**
 * Custom hook to detect media query matches
 * Handles SSR hydration safely
 *
 * @param query - CSS media query string (e.g., "(min-width: 1024px)")
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mediaQuery = window.matchMedia(query)

    // Set initial value
    setMatches(mediaQuery.matches)

    // Create event listener
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add listener
    mediaQuery.addEventListener("change", handleChange)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [query])

  // Return false during SSR and before hydration to prevent mismatches
  return mounted ? matches : false
}
