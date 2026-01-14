import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin-api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, FolderOpen, Upload, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const AdminDashboard = () => {
  const { data: photos, isLoading } = useQuery({
    queryKey: ["admin-photos"],
    queryFn: () => adminApi.getPhotos(),
  });

  const stats = photos
    ? {
        total: photos.length,
        gallery: photos.filter((p) => p.category === "gallery").length,
        menu: photos.filter((p) => p.category === "menu").length,
        venue: photos.filter((p) => p.category === "venue").length,
        active: photos.filter((p) => p.isActive).length,
      }
    : null;

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    href,
  }: {
    title: string;
    value: number;
    icon: React.ElementType;
    description: string;
    href: string;
  }) => (
    <Link to={href}>
      <Card className="hover:border-secondary/50 transition-colors cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <div className="text-2xl font-bold text-foreground">{value}</div>
          )}
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to the Light of India admin dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Photos"
          value={stats?.total || 0}
          icon={Image}
          description="All uploaded photos"
          href="/admin/photos"
        />
        <StatCard
          title="Gallery"
          value={stats?.gallery || 0}
          icon={FolderOpen}
          description="Website gallery images"
          href="/admin/photos?category=gallery"
        />
        <StatCard
          title="Menu"
          value={stats?.menu || 0}
          icon={FolderOpen}
          description="Menu item photos"
          href="/admin/photos?category=menu"
        />
        <StatCard
          title="Venue"
          value={stats?.venue || 0}
          icon={FolderOpen}
          description="Venue & event spaces"
          href="/admin/photos?category=venue"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-secondary" />
              Quick Upload
            </CardTitle>
            <CardDescription>
              Add new photos to your collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to="/admin/photos/upload"
              className="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground px-4 py-2 text-sm font-medium hover:bg-secondary/90 transition-colors"
            >
              Upload Photos
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest photo uploads and changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : photos && photos.length > 0 ? (
              <ul className="space-y-2 text-sm text-muted-foreground">
                {photos.slice(0, 3).map((photo) => (
                  <li key={photo.id} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded overflow-hidden bg-muted">
                      <img
                        src={photo.thumbnailUrl}
                        alt={photo.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="truncate">{photo.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No photos yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
