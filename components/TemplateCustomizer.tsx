import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  type EmailConfig,
  fontOptions,
  templateOptions,
  colorOptions,
  type SpacingConfig,
} from "@/types/email";

interface TemplateCustomizerProps {
  config: EmailConfig;
  onConfigChange: (key: string, value: unknown) => void;
}

export default function TemplateCustomizer({
  config,
  onConfigChange,
}: TemplateCustomizerProps) {
  const handleSpacingChange = (key: keyof SpacingConfig, value: number[]) => {
    onConfigChange("spacing", {
      ...config.spacing,
      [key]: `${value[0]}px`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="template">Template Style</Label>
        <Select
          value={config.template}
          onValueChange={(value) => onConfigChange("template", value)}
        >
          <SelectTrigger id="template">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            {templateOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="fontFamily">Font Family</Label>
        <Select
          value={config.fontFamily}
          onValueChange={(value) => onConfigChange("fontFamily", value)}
        >
          <SelectTrigger id="fontFamily">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="primaryColor">Primary Color</Label>
        <div className="flex gap-2">
          <Input
            id="primaryColor"
            type="color"
            value={config.primaryColor}
            onChange={(e) => onConfigChange("primaryColor", e.target.value)}
            className="w-20"
          />
          <Select
            value={config.primaryColor}
            onValueChange={(value) => onConfigChange("primaryColor", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Content Spacing</Label>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between">
              <span className="text-sm">Padding</span>
              <span className="text-sm">
                {Number.parseInt(config.spacing.padding)}px
              </span>
            </div>
            <Slider
              value={[Number.parseInt(config.spacing.padding)]}
              min={16}
              max={64}
              step={8}
              onValueChange={(value) => handleSpacingChange("padding", value)}
            />
          </div>
          <div>
            <div className="flex justify-between">
              <span className="text-sm">Content Spacing</span>
              <span className="text-sm">
                {Number.parseInt(config.spacing.contentSpacing)}px
              </span>
            </div>
            <Slider
              value={[Number.parseInt(config.spacing.contentSpacing)]}
              min={8}
              max={32}
              step={4}
              onValueChange={(value) =>
                handleSpacingChange("contentSpacing", value)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
