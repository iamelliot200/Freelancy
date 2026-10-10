"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../api/dashboard.api";
import { dashboardKeys } from "../api/dashboard.keys";

export function useDashboard(workspaceId: string) {
  const isValidWorkspaceId = Boolean(
    workspaceId &&
      workspaceId !== ":id" &&
      workspaceId !== "undefined" &&
      workspaceId !== "null"
  );

  return useQuery({
    queryKey: dashboardKeys.detail(workspaceId),
    queryFn: () => getDashboard(workspaceId),
    enabled: isValidWorkspaceId,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}
