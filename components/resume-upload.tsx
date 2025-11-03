// ============================================================================
// AssetFlowX - Resume Upload Component
// Component for uploading and pasting resume text
// ============================================================================

"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, FileText, X, Copy, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ResumeUploadProps {
  onResumeTextChange: (text: string) => void
  resumeText: string
}

export function ResumeUpload({ onResumeTextChange, resumeText }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    const fileType = file.type
    const fileName = file.name.toLowerCase()
    
    // Check if file type is supported
    const isPDF = fileType === "application/pdf" || fileName.endsWith(".pdf")
    const isDOCX = 
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".docx")
    const isDOC = fileType === "application/msword" || fileName.endsWith(".doc")
    const isTXT = fileType === "text/plain" || fileName.endsWith(".txt")

    // Handle plain text files directly
    if (isTXT) {
      try {
        const text = await file.text()
        onResumeTextChange(text)
        setUploadedFileName(file.name)
        toast.success("Resume file loaded successfully!")
      } catch (error) {
        setUploadedFileName(null)
        toast.error("Failed to read file. Please try again or upload a different file.")
      }
      return
    }

    // For PDF and DOCX, send to API for parsing
    if (isPDF || isDOCX) {
      setIsParsing(true)
      try {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/resume/parse", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to parse file")
        }

        const data = await response.json()
        onResumeTextChange(data.text)
        setUploadedFileName(file.name)
        toast.success(`Resume loaded successfully! (${data.characterCount} characters)`)
      } catch (error) {
        console.error("File parsing error:", error)
        setUploadedFileName(null)
        toast.error(
          error instanceof Error 
            ? error.message 
            : "Failed to parse file. Please try again or paste your resume text below."
        )
      } finally {
        setIsParsing(false)
      }
      return
    }

    // Handle old .doc format (not supported)
    if (isDOC) {
      toast.error("Old .doc format is not supported. Please convert to .docx or .pdf, or paste your resume text below.")
      return
    }

    // Unsupported file type
    toast.error("Unsupported file type. Please upload a PDF, DOCX, or TXT file, or paste your resume text below.")
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleClear = () => {
    onResumeTextChange("")
    setUploadedFileName(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(resumeText)
    toast.success("Resume text copied to clipboard!")
  }

  return (
    <div className="space-y-4">
      {/* File Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
          ${resumeText ? "bg-muted/30" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleFileInput}
          className="hidden"
          id="resume-upload"
          disabled={isParsing}
        />
        
        <div className="flex flex-col items-center gap-4">
          {isParsing ? (
            <div className="rounded-full bg-primary/10 p-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
          )}
          
          <div>
            <Label htmlFor="resume-upload" className={isParsing ? "cursor-not-allowed opacity-50" : "cursor-pointer"}>
              <span className="text-primary hover:underline font-medium">
                {isParsing ? "Parsing file..." : uploadedFileName ? "Upload different file" : "Click to upload"}
              </span>
              {!isParsing && !uploadedFileName && " or drag and drop"}
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              {isParsing 
                ? "Extracting text from your resume..." 
                : uploadedFileName 
                  ? `Uploaded: ${uploadedFileName}`
                  : "Resume file (PDF, DOCX, or TXT) or paste text below"}
            </p>
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isParsing}
          >
            {isParsing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Choose File
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Resume Text Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="resume-text">Or Paste Your Resume Text Here</Label>
          {resumeText && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          )}
        </div>
        <Textarea
          id="resume-text"
          placeholder="Paste your resume content here...&#10;&#10;Include:&#10;- Contact information&#10;- Work experience&#10;- Education&#10;- Skills&#10;- Certifications"
          value={resumeText}
          onChange={(e) => onResumeTextChange(e.target.value)}
          className="min-h-[300px] font-mono text-sm"
        />
        {resumeText && (
          <p className="text-xs text-muted-foreground">
            {resumeText.length} characters entered
          </p>
        )}
      </div>
    </div>
  )
}

