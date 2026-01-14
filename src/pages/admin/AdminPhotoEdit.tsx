import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { adminApi, PhotoCategory, PhotoSubcategory } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Save } from "lucide-react";

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

const editSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  titleNl: z.string().max(100),
  alt: z.string().min(1, "Alt text is required").max(200),
  altNl: z.string().max(200),
  category: z.enum(["gallery", "menu", "venue"]),
  subcategory: z.string(),
  isActive: z.boolean(),
});

type EditFormValues = z.infer<typeof editSchema>;

const AdminPhotoEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: photo, isLoading } = useQuery({
    queryKey: ["admin-photo", id],
    queryFn: () => adminApi.getPhoto(id!),
    enabled: !!id,
  });

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: "",
      titleNl: "",
      alt: "",
      altNl: "",
      category: "gallery",
      subcategory: "food",
      isActive: true,
    },
  });

  useEffect(() => {
    if (photo) {
      form.reset({
        title: photo.title,
        titleNl: photo.titleNl || "",
        alt: photo.alt,
        altNl: photo.altNl || "",
        category: photo.category,
        subcategory: photo.subcategory,
        isActive: photo.isActive,
      });
    }
  }, [photo, form]);

  const updateMutation = useMutation({
    mutationFn: (data: EditFormValues) =>
      adminApi.updatePhoto(id!, {
        title: data.title,
        titleNl: data.titleNl || undefined,
        alt: data.alt,
        altNl: data.altNl || undefined,
        category: data.category,
        subcategory: data.subcategory as PhotoSubcategory,
        isActive: data.isActive,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-photos"] });
      queryClient.invalidateQueries({ queryKey: ["admin-photo", id] });
      toast({
        title: "Photo updated",
        description: "Changes have been saved.",
      });
      navigate("/admin/photos");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Update failed",
        variant: "destructive",
      });
    },
  });

  const watchCategory = form.watch("category");

  const onSubmit = (data: EditFormValues) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-48 w-48" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Photo not found</p>
        <Button variant="link" onClick={() => navigate("/admin/photos")}>
          Back to photos
        </Button>
      </div>
    );
  }

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
          <h1 className="text-3xl font-display text-foreground">Edit Photo</h1>
          <p className="text-muted-foreground mt-1">{photo.originalName}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Preview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square rounded overflow-hidden bg-muted">
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Uploaded: {new Date(photo.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Photo Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (EN) *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="titleNl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (NL)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="alt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alt Text (EN) *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Describe the image" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="altNl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alt Text (NL)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(v) => {
                            field.onChange(v);
                            form.setValue(
                              "subcategory",
                              subcategoryOptions[v as PhotoCategory][0].value
                            );
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="gallery">Gallery</SelectItem>
                            <SelectItem value="menu">Menu</SelectItem>
                            <SelectItem value="venue">Venue</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subcategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subcategory</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subcategoryOptions[watchCategory].map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Visible on website</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          When disabled, the photo will be hidden from the public website
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="bg-secondary text-secondary-foreground"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin/photos")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPhotoEdit;
