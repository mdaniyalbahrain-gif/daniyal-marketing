import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Redirecting…" }, { name: "robots", content: "noindex" }] }),
  component: () => <Navigate to="/" replace />,
});
