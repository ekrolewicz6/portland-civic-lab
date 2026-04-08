import { redirect } from "next/navigation";

// The dashboard IS the homepage now — redirect this legacy route.
export default function DashboardPage() {
  redirect("/");
}
