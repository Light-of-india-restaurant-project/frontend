import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router-dom";
import { adminApi, AdminPhoto, PhotoCategory } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  GripVertical,
  Image as ImageIcon,
} from "lucide-react";

const categories: { value: PhotoCategory | "all"; label: string }[] = [
  { value: "all", label: "All Photos" },
  { value: "gallery", label: "Gallery" },
  { value: "menu", label: "Menu" },
  { value: "venue", label: "Venue" },
];

const AdminPhotos = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") as PhotoCategory | null;
  const [activeCategory, setActiveCategory] = useState<PhotoCategory | "all">(
    categoryParam || "all"
  );
  const [deletePhoto, setDeletePhoto] = useState<AdminPhoto | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: photos, isLoading } = useQuery({
    queryKey: ["admin-photos", activeCategory],
    queryFn: () =>
      adminApi.getPhotos(activeCategory === "all" ? undefined : activeCategory),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminApi.updatePhoto(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-photos"] });
      toast({
        title: "Photo updated",
        description: "Visibility has been changed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Update failed",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deletePhoto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-photos"] });
      toast({
        title: "Photo deleted",
        description: "The photo has been removed.",
      });
      setDeletePhoto(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Delete failed",
        variant: "destructive",
      });
    },
  });

  const handleCategoryChange = (value: string) => {
    const cat = value as PhotoCategory | "all";
    setActiveCategory(cat);
    if (cat === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-foreground">Photos</h1>
          <p className="text-muted-foreground mt-1">
            Manage all website photos and images
          </p>
        </div>
        <Link to="/admin/photos/upload">
          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Plus className="w-4 h-4 mr-2" />
            Upload Photos
          </Button>
        </Link>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={handleCategoryChange}>
        <TabsList className="bg-muted">
          {categories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Photo Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="aspect-square" />
              <CardContent className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : photos && photos.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {photos.map((photo) => (
            <Card
              key={photo.id}
              className={`overflow-hidden group ${
                !photo.isActive ? "opacity-60" : ""
              }`}
            >
              <div className="aspect-square relative bg-muted">
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() =>
                      toggleActiveMutation.mutate({
                        id: photo.id,
                        isActive: !photo.isActive,
                      })
                    }
                  >
                    {photo.isActive ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Link to={`/admin/photos/${photo.id}/edit`}>
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => setDeletePhoto(photo)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {!photo.isActive && (
                  <Badge
                    variant="secondary"
                    className="absolute top-2 right-2 bg-muted/90"
                  >
                    Hidden
                  </Badge>
                )}
              </div>
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate text-foreground">
                      {photo.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {photo.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {photo.subcategory}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">No photos yet</h3>
          <p className="text-muted-foreground mt-1">
            Upload your first photo to get started
          </p>
          <Link to="/admin/photos/upload" className="mt-4 inline-block">
            <Button className="bg-secondary text-secondary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Upload Photos
            </Button>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePhoto} onOpenChange={() => setDeletePhoto(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletePhoto?.title}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deletePhoto && deleteMutation.mutate(deletePhoto.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPhotos;
