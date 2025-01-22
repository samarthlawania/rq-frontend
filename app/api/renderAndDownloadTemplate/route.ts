import { NextResponse } from "next/server"
import type { EmailConfig } from "@/types/email"

export async function POST(request: Request) {
  try {
    const config: EmailConfig = await request.json()

    // Log the received configuration
    console.log("Received config for template:", config)

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    const response = await fetch(`${API_URL}/api/renderAndDownloadTemplate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/html",
      },
      body: JSON.stringify(config),
      mode: 'cors',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Backend error:", errorText)
      throw new Error(`Backend returned ${response.status}: ${errorText}`)
    }

    const html = await response.text()

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="email_template_${Date.now()}.html"`,
      },
    })
  } catch (error) {
    console.error("Error in renderAndDownloadTemplate:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}

