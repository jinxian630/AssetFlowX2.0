// ============================================================================
// AssetFlowX - Resume Parsing API Route
// Parse PDF and DOCX files to extract text content
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import mammoth from "mammoth"

// Force Node.js runtime for pdf-parse compatibility
export const runtime = 'nodejs'
// Increase max duration for large PDF files (default is 10s)
export const maxDuration = 30

// Dynamic import for pdf-parse to avoid build issues
const getPdfParser = async () => {
  const pdfParseModule = await import("pdf-parse")
  // pdf-parse v2.x exports PDFParse class
  // Type assertion needed because TypeScript doesn't recognize the class export on dynamic import
  type PDFParseClass = new (options: { data: Buffer }) => {
    getText(): Promise<{ text: string; info?: any; metadata?: any }>
  }
  const PDFParse = (pdfParseModule as unknown as { PDFParse: PDFParseClass }).PDFParse
  
  if (!PDFParse || typeof PDFParse !== 'function') {
    throw new Error("PDFParse class not found in pdf-parse module")
  }
  
  // Return a function that creates an instance and extracts text
  return async (buffer: Buffer) => {
    const parser = new PDFParse({ data: buffer })
    const result = await parser.getText()
    return { text: result.text, characterCount: result.text.length }
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    const fileType = file.type
    const fileName = file.name.toLowerCase()

    let extractedText: string

    // Handle PDF files
    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      try {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const pdfParse = await getPdfParser()
        const data = await pdfParse(buffer)
        extractedText = data.text
      } catch (error) {
        console.error("PDF parsing error:", error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        console.error("PDF parsing error details:", {
          message: errorMessage,
          stack: error instanceof Error ? error.stack : undefined,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        })
        return NextResponse.json(
          { error: `Failed to parse PDF file: ${errorMessage}. The file may be corrupted, encrypted, or unsupported.` },
          { status: 400 }
        )
      }
    }
    // Handle DOCX files
    else if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".docx")
    ) {
      try {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const result = await mammoth.extractRawText({ buffer })
        extractedText = result.value
        
        // Include any messages (like warnings about unsupported elements)
        if (result.messages.length > 0) {
          console.warn("DOCX parsing messages:", result.messages)
        }
      } catch (error) {
        console.error("DOCX parsing error:", error)
        return NextResponse.json(
          { error: "Failed to parse DOCX file. The file may be corrupted." },
          { status: 400 }
        )
      }
    }
    // Handle DOC files (older Word format)
    else if (
      fileType === "application/msword" ||
      fileName.endsWith(".doc")
    ) {
      return NextResponse.json(
        { error: ".doc files (older Word format) are not supported. Please convert to .docx or .pdf format." },
        { status: 400 }
      )
    }
    // Handle plain text files
    else if (fileType === "text/plain" || fileName.endsWith(".txt")) {
      extractedText = await file.text()
    }
    else {
      return NextResponse.json(
        { error: `Unsupported file type: ${fileType || "unknown"}. Please upload a PDF, DOCX, or TXT file.` },
        { status: 400 }
      )
    }

    // Clean up extracted text
    const cleanedText = extractedText
      .replace(/\s+/g, " ") // Replace multiple whitespace with single space
      .replace(/\n{3,}/g, "\n\n") // Replace 3+ newlines with double newline
      .trim()

    if (!cleanedText || cleanedText.length < 50) {
      return NextResponse.json(
        { error: "The file appears to be empty or contains too little text. Please ensure it's a valid resume file." },
        { status: 400 }
      )
    }

    return NextResponse.json({
      text: cleanedText,
      characterCount: cleanedText.length,
      fileName: file.name,
    })
  } catch (error) {
    console.error("Resume parsing error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to parse resume file" },
      { status: 500 }
    )
  }
}

