import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
import TemplateCustomizer from "./TemplateCustomizer"
import type { EmailConfig } from "@/types/email"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface EmailEditorProps {
  config: EmailConfig
  onConfigChange: (key: string, value: any) => void
  onImageUpload: (file: File | null) => void
}

export default function EmailEditor({ config, onConfigChange, onImageUpload }: EmailEditorProps) {
  const [imageError, setImageError] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [imageSrc, setImageSrc] = useState<string>("/placeholder.svg")

  useEffect(() => {
    if (config.imageUrl) {
      setImageSrc(config.imageUrl)
      setImageError(false)
    } else {
      setImageSrc("/placeholder.svg")
    }
  }, [config.imageUrl])

  const handleImageError = () => {
    setImageError(true)
    console.error("Error loading image:", config.imageUrl)
    setImageSrc("/placeholder.svg")
  }

  const getImageSrc = (url: string) => {
    if (!url) return "/placeholder.svg"
    if (url.startsWith("http") || url.startsWith("https")) return url
    if (url.startsWith("/uploads/")) return `${API_URL}${url}`
    return url
  }

  const getTemplateStyles = () => {
    const styles: Record<string, string> = {
      fontFamily: config.fontFamily || "arial, sans-serif",
      "--primary-color": config.primaryColor || "#2563eb",
      padding: config.spacing?.padding || "32px",
    }
    return styles
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Email Editor</h2>
        <div className="flex items-center gap-2">
          <Label htmlFor="preview">Preview Mode</Label>
          <Switch id="preview" checked={previewMode} onCheckedChange={setPreviewMode} />
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={config.title} onChange={(e) => onConfigChange("title", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={config.content}
              onChange={(e) => onConfigChange("content", e.target.value)}
              rows={5}
            />
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null
                onImageUpload(file)
                setImageError(false)
              }}
              accept="image/*"
            />
          </div>
          {config.imageUrl && !imageError && (
            <div className="mt-4 relative w-full h-64">
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt="Uploaded preview"
                fill
                style={{ objectFit: "contain" }}
                onError={handleImageError}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="style">
          <TemplateCustomizer config={config} onConfigChange={onConfigChange} />
        </TabsContent>
      </Tabs>

      {previewMode && (
        <div className="border rounded-lg p-4 mt-6">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          <div className="border rounded-lg overflow-hidden" style={getTemplateStyles()}>
            <div style={{ gap: config.spacing?.contentSpacing || "16px" }} className="flex flex-col">
              <h1 className="text-2xl font-bold" style={{ color: config.primaryColor }}>
                {config.title || "Email Title"}
              </h1>
              <p className="whitespace-pre-wrap">{config.content || "Email content goes here..."}</p>
              {config.imageUrl && !imageError && (
                <div className="relative w-full h-64">
                  <Image
                    src={imageSrc || "/placeholder.svg"}
                    alt="Email preview"
                    fill
                    style={{ objectFit: "contain" }}
                    className="rounded-md"
                    onError={handleImageError}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

