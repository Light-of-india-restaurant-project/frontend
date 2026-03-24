import { useQuery } from "@tanstack/react-query";
import { api, OperatingHours } from "@/lib/api";

type Language = "en" | "nl";

const dayNamesEN: Record<string, string> = {
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
};

const dayNamesNL: Record<string, string> = {
  sunday: "Zondag",
  monday: "Maandag",
  tuesday: "Dinsdag",
  wednesday: "Woensdag",
  thursday: "Donderdag",
  friday: "Vrijdag",
  saturday: "Zaterdag",
};

const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export interface HoursGroup {
  days: string;
  hours: string;
  isOpen: boolean;
}

function getDayName(day: string, language: Language): string {
  return language === "nl" ? dayNamesNL[day] ?? day : dayNamesEN[day] ?? day;
}

/**
 * Groups consecutive days that share the same open/close times into ranges.
 * E.g. Mon-Fri 15:00-22:00, Sat-Sun Closed
 */
function groupOperatingHours(operatingHours: OperatingHours[], language: Language): HoursGroup[] {
  // Sort by standard week order
  const sorted = [...operatingHours].sort(
    (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
  );

  const groups: HoursGroup[] = [];
  let i = 0;

  while (i < sorted.length) {
    const current = sorted[i];
    const startIdx = i;

    // Find consecutive days with the same schedule
    while (
      i + 1 < sorted.length &&
      sorted[i + 1].isOpen === current.isOpen &&
      sorted[i + 1].openTime === current.openTime &&
      sorted[i + 1].closeTime === current.closeTime
    ) {
      i++;
    }

    const startDay = getDayName(sorted[startIdx].day, language);
    const endDay = getDayName(sorted[i].day, language);
    const days = startIdx === i ? startDay : `${startDay} - ${endDay}`;

    // Check if all 7 days share the same schedule
    const isAllDays = startIdx === 0 && i === sorted.length - 1;
    const allDaysLabel = language === "nl" ? "Elke Dag" : "Every Day";

    groups.push({
      days: isAllDays ? allDaysLabel : days,
      hours: current.isOpen ? `${current.openTime} - ${current.closeTime}` : language === "nl" ? "Gesloten" : "Closed",
      isOpen: current.isOpen,
    });

    i++;
  }

  return groups;
}

/**
 * Returns a single-line summary like "15:00 - 22:00 Every Day"
 */
function formatSummary(operatingHours: OperatingHours[], language: Language): string {
  const groups = groupOperatingHours(operatingHours, language);
  const openGroups = groups.filter((g) => g.isOpen);
  if (openGroups.length === 0) return language === "nl" ? "Gesloten" : "Closed";
  return openGroups.map((g) => `${g.days}: ${g.hours}`).join(", ");
}

export function useOperatingHours() {
  const query = useQuery({
    queryKey: ["reservation-settings"],
    queryFn: () => api.getReservationSettings(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });

  const operatingHours = query.data?.data?.operatingHours ?? [];

  return {
    ...query,
    operatingHours,
    getGroupedHours: (language: Language) => groupOperatingHours(operatingHours, language),
    getSummary: (language: Language) => formatSummary(operatingHours, language),
  };
}
