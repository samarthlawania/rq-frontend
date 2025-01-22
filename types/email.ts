export interface EmailConfig {
  id?: number
  title: string
  content: string
  imageUrl: string
  template: TemplateType
  fontFamily: string
  primaryColor: string
  spacing: SpacingConfig
}

export type TemplateType = "standard" | "modern" | "minimal"

export interface SpacingConfig {
  padding: string
  contentSpacing: string
}

export const defaultSpacing: SpacingConfig = {
  padding: "32px",
  contentSpacing: "16px",
}

export const fontOptions = [
  { label: "Arial", value: "arial, sans-serif" },
  { label: "Times New Roman", value: "times new roman, serif" },
  { label: "Helvetica", value: "helvetica, arial, sans-serif" },
  { label: "Georgia", value: "georgia, serif" },
]

export const templateOptions = [
  { label: "Standard", value: "standard" },
  { label: "Modern", value: "modern" },
  { label: "Minimal", value: "minimal" },
]

export const colorOptions = [
  { label: "Blue", value: "#2563eb" },
  { label: "Green", value: "#16a34a" },
  { label: "Purple", value: "#7c3aed" },
  { label: "Red", value: "#dc2626" },
]

export const initialConfig: EmailConfig = {
  title: "",
  content: "",
  imageUrl: "",
  template: "standard",
  fontFamily: "arial, sans-serif",
  primaryColor: "#2563eb",
  spacing: defaultSpacing,
}

