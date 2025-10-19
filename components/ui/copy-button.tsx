// ============================================================================
// AssetFlowX - CopyButton Component
// Copy text to clipboard with visual feedback
// ============================================================================

"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function CopyButton({
  text,
  label,
  className,
  variant = "ghost",
  size = "icon",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success(label ? `${label} copied!` : "Copied to clipboard!")

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      toast.error("Failed to copy to clipboard")
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn("h-8 w-8", className)}
      title={label ? `Copy ${label}` : "Copy to clipboard"}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  )
}

/**
 * CopyText - Shows text with an inline copy button
 */
interface CopyTextProps {
  text: string
  label?: string
  truncate?: boolean
  className?: string
}

export function CopyText({ text, label, truncate = true, className }: CopyTextProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <code
        className={cn(
          "rounded bg-muted px-2 py-1 text-sm font-mono",
          truncate && "max-w-[200px] truncate"
        )}
        title={text}
      >
        {text}
      </code>
      <CopyButton text={text} label={label} />
    </div>
  )
}
