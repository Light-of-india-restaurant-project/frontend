import { Skeleton } from "@/components/ui/skeleton";

interface MenuItemSkeletonProps {
  hasImage?: boolean;
}

export const MenuItemSkeleton = ({ hasImage = false }: MenuItemSkeletonProps) => {
  return (
    <div
      className={`bg-card border border-border overflow-hidden ${
        hasImage ? 'grid md:grid-cols-[280px,1fr]' : ''
      }`}
    >
      {hasImage && (
        <Skeleton className="h-56 md:h-full w-full" />
      )}
      
      <div className="p-6 md:p-8 flex flex-col justify-center">
        <div className="flex justify-between items-start gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-48" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-5 w-full max-w-md" />
            <Skeleton className="h-5 w-3/4 max-w-sm" />
          </div>
          <Skeleton className="h-7 w-12" />
        </div>
      </div>
    </div>
  );
};

export const MenuCategorySkeleton = () => {
  return (
    <div className="space-y-24">
      {[1, 2, 3].map((categoryIndex) => (
        <div key={categoryIndex}>
          {/* Category Header Skeleton */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Skeleton className="h-8 w-48" />
            </div>
            <div className="w-32 h-px bg-muted mx-auto" />
          </div>

          {/* Menu Items Grid Skeleton */}
          <div className="grid gap-8">
            {[1, 2, 3].map((itemIndex) => (
              <MenuItemSkeleton 
                key={itemIndex} 
                hasImage={itemIndex === 1 || itemIndex === 2} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
