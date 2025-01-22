"use client"

import { useState, useEffect } from "react"
import EmailEditor from "@/components/EmailEditor"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { type EmailConfig, defaultSpacing, initialConfig } from "@/types/email"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false)
  const [emailConfig, setEmailConfig] = useState<EmailConfig>(initialConfig)
  const [savedConfigs, setSavedConfigs] = useState<EmailConfig[]>([])

  useEffect(() => {
    fetchEmailLayout()
    fetchSavedConfigs()
  }, [])

  const fetchEmailLayout = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/getEmailLayout`)
      if (!response.ok) {
        throw new Error(`Error fetching email layout: ${response.status}`)
      }
      const data = await response.json()
      setEmailConfig((prevConfig) => ({
        ...prevConfig,
        ...data,
        spacing: { ...prevConfig.spacing, ...data.spacing },
      }))
      console.log("Email layout fetched:", data)
    } catch (error) {
      console.error("Error fetching layout:", error)
      alert("Failed to fetch email layout. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const fetchSavedConfigs = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/getEmailConfigs`)
      if (!response.ok) {
        throw new Error("Error fetching saved configurations")
      }
      const data = await response.json()
      setSavedConfigs(data)
    } catch (error) {
      console.error("Error fetching saved configs:", error)
      alert("Failed to fetch saved configurations.")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File | null) => {
    if (!file) {
      alert("Please select an image before uploading.")
      return
    }

    setLoading(true)
    try {
      const base64 = await convertToBase64(file)
      setEmailConfig((prev) => ({
        ...prev,
        imageUrl: base64,
      }))

      alert("Image processed successfully!")
    } catch (error) {
      console.error("Error processing image:", error)
      alert("Failed to process image. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleConfigChange = (key: string, value: any) => {
    setEmailConfig((prev) => {
      if (key === "spacing") {
        return { ...prev, spacing: { ...prev.spacing, ...value } }
      }
      return { ...prev, [key]: value }
    })
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/uploadEmailConfig`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailConfig),
      })

      if (!response.ok) throw new Error("Failed to save email configuration")

      alert("Email configuration saved successfully!")
      fetchSavedConfigs() // Refresh the saved configs after saving
    } catch (error) {
      console.error("Error saving configuration:", error)
      alert("Failed to save email configuration")
    } finally {
      setLoading(false)
    }
  }

  const handleRenderAndDownload = async () => {
    setLoading(true)
    try {
      console.log("Sending email config:", {
        ...emailConfig,
        imageUrl: emailConfig.imageUrl ? "Base64 image data (truncated)" : "No image",
      })

      const response = await fetch(`${API_URL}/api/renderAndDownloadTemplate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/html",
        },
        body: JSON.stringify(emailConfig),
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error("Server response:", errorData)
        throw new Error(`Failed to download template: ${response.status} ${response.statusText}`)
      }

      const blob = await response.blob()
      if (blob.size === 0) {
        throw new Error("Received empty response from server")
      }

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `email_template_${Date.now()}.html`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      console.log("Template downloaded successfully")
    } catch (error) {
      console.error("Error downloading template:", error)
      alert(error instanceof Error ? error.message : "Error downloading template. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLoadConfig = (config: EmailConfig) => {
    setEmailConfig({
      ...initialConfig,
      ...config,
      spacing: { ...defaultSpacing, ...config.spacing },
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Email Builder</h1>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center">
            <Loader2 className="animate-spin mr-2" />
            <p>Loading...</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <EmailEditor config={emailConfig} onConfigChange={handleConfigChange} onImageUpload={handleImageUpload} />

              <div className="mt-6 space-x-4">
                <Button onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700">
                  {loading ? "Saving..." : "Save Configuration"}
                </Button>
                <Button onClick={handleRenderAndDownload} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  {loading ? "Downloading..." : "Render and Download"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Saved Configurations</h2>
              {savedConfigs.length === 0 ? (
                <p className="text-gray-500 italic">No saved configurations yet.</p>
              ) : (
                <ul className="space-y-6">
                  {savedConfigs.map((config) => (
                    <li key={config.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-semibold" style={{ color: config.primaryColor }}>
                          {config.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2" style={{ fontFamily: config.fontFamily }}>
                          {config.content}
                        </p>
                        {config.imageUrl && (
                          <div className="relative w-full h-32">
                            <Image
                              src={config.imageUrl || "/placeholder.svg"}
                              alt={`Image for ${config.title}`}
                              fill
                              style={{ objectFit: "contain" }}
                              className="rounded-md"
                            />
                          </div>
                        )}
                        <Button
                          onClick={() => handleLoadConfig(config)}
                          variant="outline"
                          className="mt-2 bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Load Configuration
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

