import { writeFile } from "fs/promises"
import { type NextRequest, NextResponse } from "next/server"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Add timestamp and sanitize the filename (remove spaces)
    const sanitizedFileName = file.name.replace(/\s+/g, "_")
    const filename = `${Date.now()}-${sanitizedFileName}`
    const uploadDir = path.join(process.cwd(), "public/uploads")
    const filepath = path.join(uploadDir, filename)

    await writeFile(filepath, buffer)
    console.log("File saved to:", filepath)

    return NextResponse.json({
      message: "File uploaded successfully",
      path: `/uploads/${filename}`, // Return correct path
    })
  } catch (error) {
    console.error("Error saving file:", error)
    return NextResponse.json({ error: "Error saving file" }, { status: 500 })
  }
}

