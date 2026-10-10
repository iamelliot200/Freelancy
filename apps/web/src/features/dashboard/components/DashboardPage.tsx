"use client";

import { ActivityFeed } from "@features/activity";
import { useDashboard } from "../hooks/useDashboard";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardOverview } from "./DashboardOverview";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { InvoiceSummaryCard } from "./InvoiceSummaryCard";
import { OverdueAlertBanner } from "./OverdueAlertBanner";
import { ProjectDeadlines } from "./ProjectDeadlines";
import { RecentInvoicesList } from "./RecentInvoicesList";

interface DashboardPageProps {
  workspaceId: string;
}

export function DashboardPage({ workspaceId }: DashboardPageProps) {
  const isInvalidWorkspaceId =
    !workspaceId ||
    workspaceId === ":id" ||
    workspaceId === "undefined" ||
    workspaceId === "null";

  const {
    data: dashboard,
    isLoading,
    error,
    refetch,
  } = useDashboard(workspaceId);

  if (isInvalidWorkspaceId) {
    return (
      <div className="w-full min-h-screen bg-[var(--color-surface-soft)] flex items-center justify-center p-6">
        <div className="p-8 text-center bg-white rounded-3xl border border-[var(--color-hairline-soft)] shadow-sm max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FFD02F] text-black font-bold flex items-center justify-center mx-auto text-lg shadow-xs">
            !
          </div>
          <h2 className="text-xl font-bold text-[var(--color-ink)]">No Workspace Selected</h2>
          <p className="text-sm text-muted-foreground">
            Please select a workspace from your workspaces directory to access the dashboard.
          </p>
          <a
            href="/workspaces"
            className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-black hover:bg-zinc-800 rounded-full transition shadow-sm"
          >
            Go to Workspaces
          </a>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[var(--color-surface-soft)]">
        <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-14 lg:py-16 pb-24">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-[var(--color-surface-soft)] flex items-center justify-center p-6">
        <div className="p-8 text-center bg-white rounded-3xl border border-red-200 shadow-sm max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center mx-auto text-lg">
            !
          </div>
          <h2 className="text-lg font-bold text-[var(--color-ink)]">Failed to load dashboard</h2>
          <p className="text-xs text-muted-foreground">
            {error instanceof Error ? error.message : "You may not have permissions or this workspace does not exist."}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => refetch()}
              className="px-5 py-2 text-xs font-semibold bg-zinc-100 text-zinc-800 hover:bg-zinc-200 rounded-full transition"
            >
              Retry
            </button>
            <a
              href="/workspaces"
              className="px-5 py-2 text-xs font-semibold bg-black text-white hover:bg-zinc-800 rounded-full transition shadow-xs"
            >
              Switch Workspace
            </a>
          </div>
        </div>
      </div>
    );
  }

  const isBrandNewWorkspace =
    dashboard?.overview.totalClientsCount === 0 &&
    dashboard?.overview.activeProjectsCount === 0 &&
    dashboard?.overview.totalInvoiced.amount === 0;

  if (isBrandNewWorkspace) {
    return (
      <div className="w-full min-h-screen bg-[var(--color-surface-soft)]">
        <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-14 lg:py-16 pb-24 space-y-10">
          <DashboardHeader workspaceId={workspaceId} />
          <DashboardEmptyState workspaceId={workspaceId} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[var(--color-surface-soft)]">
      <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-14 lg:py-16 pb-24 space-y-10">
        {/* Header */}
        <DashboardHeader workspaceId={workspaceId} />

        {/* Overdue Alert Banner */}
        {dashboard?.overdueAlerts && (
          <OverdueAlertBanner
            workspaceId={workspaceId}
            alerts={dashboard.overdueAlerts}
          />
        )}

        {/* KPI Overview Row */}
        {dashboard?.overview && (
          <DashboardOverview overview={dashboard.overview} />
        )}

        {/* Deliverables & Finance Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProjectDeadlines
            workspaceId={workspaceId}
            deadlines={dashboard?.upcomingDeadlines || []}
          />
          <InvoiceSummaryCard
            workspaceId={workspaceId}
            summary={
              dashboard?.invoiceSummary || {
                draftCount: 0,
                sentCount: 0,
                paidCount: 0,
                overdueCount: 0,
                cancelledCount: 0,
              }
            }
          />
        </div>

        {/* Tables & Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentInvoicesList
              workspaceId={workspaceId}
              invoices={dashboard?.recentInvoices || []}
            />
          </div>
          <div className="lg:col-span-1">
            <ActivityFeed workspaceId={workspaceId} maxItems={6} />
          </div>
        </div>
      </div>
    </div>
  );
}
