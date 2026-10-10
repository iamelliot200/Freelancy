"use client";

/**
 * Hook to fetch all workspaces
 * Wraps TanStack Query, never call useQuery directly in components
 */

import { useQuery } from "@tanstack/react-query";
import { getWorkspaces, workspaceKeys } from "../api";

export function useWorkspaces() {
  return useQuery({
    queryKey: workspaceKeys.list(),
    queryFn: async () => {
      const data = await getWorkspaces();
      return (data || []).filter(ws => ws.id !== ":id");
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
