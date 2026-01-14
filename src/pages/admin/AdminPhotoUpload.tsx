import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, PhotoCategory, PhotoSubcategory } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Loader2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { z } from "zod";

const subcategoryOptions: Record<PhotoCategory, { value: PhotoSubcategory; label: string }[]> = {
  gallery: [
    { value: "food", label: "Food" },
    { value: "ambiance", label: "Ambiance" },
    { value: "events", label: "Events" },
  ],
  menu: [
    { value: "food", label: "Dishes" },
  ],
  venue: [
    { value: "interior", label: "Interior" },
    { value: "terrace", label: "Terrace" },
    { value: "private-dining", label: "Private Dining" },
  ],
};

const uploadSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  titleNl: z.string().max(100).optional(),
  alt: z.string().min(1, "Alt text is required").max(200),
  altNl: z.string().max(200).optional(),
});

interface UploadItem {
  file: File;
  preview: string;
  title: string;
  titleNl: string;
  alt: string;
  altNl: string;
  category: PhotoCategory;
  subcategory: PhotoSubcategory;
  uploading: boolean;
  error?: string;
  success?: boolean;
}

const AdminPhotoUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [category, setCategory] = useState<PhotoCategory>("gallery");
  const [subcategory, setSubcategory] = useState<PhotoSubcategory>("food");
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: (item: UploadItem) =>
      adminApi.uploadPhoto({
        file: item.file,
        category: item.category,
        subcategory: item.subcategory,
        title: item.title,
        titleNl: item.titleNl || undefined,
        alt: item.alt,
        altNl: item.altNl || undefined,
      }),
  });

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const validFiles = files.filter((file) => {
        if (!file.type.startsWith("image/")) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an image`,
            variant: "destructive",
          });
          return false;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds 10MB limit`,
            variant: "destructive",
          });
          return false;
        }
        return true;
      });

      const newItems: UploadItem[] = validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        titleNl: "",
        alt: "",
        altNl: "",
        category,
        subcategory,
        uploading: false,
      }));

      setItems((prev) => [...prev, ...newItems]);
      e.target.value = "";
    },
    [category, subcategory, toast]
  );

  const updateItem = (index: number, updates: Partial<UploadItem>) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  };

  const removeItem = (index: number) => {
    setItems((prev) => {
      const item = prev[index];
      URL.revokeObjectURL(item.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUploadAll = async () => {
    // Validate all items
    const errors: number[] = [];
    items.forEach((item, index) => {
      const result = uploadSchema.safeParse({
        title: item.title,
        titleNl: item.titleNl,
        alt: item.alt,
        altNl: item.altNl,
      });
      if (!result.success) {
        errors.push(index);
        updateItem(index, { error: result.error.errors[0].message });
      }
    });

    if (errors.length > 0) {
      toast({
        title: "Validation errors",
        description: "Please fix the highlighted fields",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.success) continue;

      updateItem(i, { uploading: true, error: undefined });

      try {
        await uploadMutation.mutateAsync(item);
        updateItem(i, { uploading: false, success: true });
        successCount++;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Upload failed";
        updateItem(i, { uploading: false, error: message });
        errorCount++;
      }
    }

    setIsUploading(false);

    if (successCount > 0) {
      queryClient.invalidateQueries({ queryKey: ["admin-photos"] });
      toast({
        title: "Upload complete",
        description: `${successCount} photo(s) uploaded successfully${
          errorCount > 0 ? `, ${errorCount} failed` : ""
        }`,
      });
    }

    if (errorCount === 0 && successCount > 0) {
      navigate("/admin/photos");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/photos")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-display text-foreground">Upload Photos</h1>
          <p className="text-muted-foreground mt-1">
            Add new photos to your collection
          </p>
        </div>
      </div>

      {/* Default Category Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Default Category</CardTitle>
          <CardDescription>
            Set the default category for new uploads
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="w-48">
            <Label>Category</Label>
            <Select
              value={category}
              onValueChange={(v) => {
                setCategory(v as PhotoCategory);
                setSubcategory(subcategoryOptions[v as PhotoCategory][0].value);
              }}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gallery">Gallery</SelectItem>
                <SelectItem value="menu">Menu</SelectItem>
                <SelectItem value="venue">Venue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-48">
            <Label>Subcategory</Label>
            <Select
              value={subcategory}
              onValueChange={(v) => setSubcategory(v as PhotoSubcategory)}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subcategoryOptions[category].map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Drop Zone */}
      <Card>
        <CardContent className="p-6">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-secondary/50 transition-colors"
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Click to upload</span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, WEBP up to 10MB
            </p>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        </CardContent>
      </Card>

      {/* Upload Items */}
      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">
              {items.length} photo(s) ready
            </h2>
            <Button
              onClick={handleUploadAll}
              disabled={isUploading || items.every((i) => i.success)}
              className="bg-secondary text-secondary-foreground"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload All
                </>
              )}
            </Button>
          </div>

          {items.map((item, index) => (
            <Card
              key={index}
              className={`${item.success ? "border-green-500/50 bg-green-500/5" : ""} ${
                item.error ? "border-destructive/50" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0 rounded overflow-hidden bg-muted">
                    <img
                      src={item.preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Title (EN) *</Label>
                      <Input
                        value={item.title}
                        onChange={(e) => updateItem(index, { title: e.target.value })}
                        disabled={item.uploading || item.success}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Title (NL)</Label>
                      <Input
                        value={item.titleNl}
                        onChange={(e) => updateItem(index, { titleNl: e.target.value })}
                        disabled={item.uploading || item.success}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Alt Text (EN) *</Label>
                      <Input
                        value={item.alt}
                        onChange={(e) => updateItem(index, { alt: e.target.value })}
                        placeholder="Describe the image for accessibility"
                        disabled={item.uploading || item.success}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Alt Text (NL)</Label>
                      <Input
                        value={item.altNl}
                        onChange={(e) => updateItem(index, { altNl: e.target.value })}
                        disabled={item.uploading || item.success}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {item.uploading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-secondary" />
                    ) : item.success ? (
                      <ImageIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeItem(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Select
                      value={item.category}
                      onValueChange={(v) => {
                        const cat = v as PhotoCategory;
                        updateItem(index, {
                          category: cat,
                          subcategory: subcategoryOptions[cat][0].value,
                        });
                      }}
                      disabled={item.uploading || item.success}
                    >
                      <SelectTrigger className="w-28 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gallery">Gallery</SelectItem>
                        <SelectItem value="menu">Menu</SelectItem>
                        <SelectItem value="venue">Venue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {item.error && (
                  <p className="text-sm text-destructive mt-2">{item.error}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPhotoUpload;
