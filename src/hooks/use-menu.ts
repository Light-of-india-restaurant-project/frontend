import { useQuery } from "@tanstack/react-query";
import { api, MenuResponse } from "@/lib/api";

export function useMenu(menuType: "dine-in" | "takeaway") {
  return useQuery<MenuResponse>({
    queryKey: ["menu", menuType],
    queryFn: () => 
      menuType === "dine-in" ? api.getMenuDineIn() : api.getMenuTakeaway(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1, // Fewer retries for faster fallback
    retryDelay: 1000, // 1 second between retries
    // Show stale data immediately while fetching fresh data
    placeholderData: (previousData) => previousData,
  });
}
