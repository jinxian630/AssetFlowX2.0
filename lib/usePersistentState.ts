"use client"

import { useState, useEffect, Dispatch, SetStateAction } from "react"

/**
 * A hook that syncs state to localStorage without causing hydration errors
 * @param key - The localStorage key
 * @param initialValue - The initial value if no stored value exists
 * @returns A stateful value and setter, similar to useState
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  // Always start with initialValue on server and first client render
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage after hydration
  useEffect(() => {
    setIsHydrated(true)
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.warn(`Error loading localStorage key "${key}":`, error)
    }
  }, [key])

  // Update localStorage when state changes (but not during initial hydration)
  useEffect(() => {
    if (!isHydrated) return

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.warn(`Error saving localStorage key "${key}":`, error)
    }
  }, [key, storedValue, isHydrated])

  return [storedValue, setStoredValue]
}
