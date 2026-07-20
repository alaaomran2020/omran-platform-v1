import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export { DashboardPage, NewProjectDialog, typeLabel } from "./dashboard-content";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: lazyRouteComponent(() => import('./dashboard-content').then((m) => ({ default: m.DashboardPage })), 'default'),
});
