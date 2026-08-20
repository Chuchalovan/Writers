import { AppShell } from "@/components/layout/app-shell";
import { redirect } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();

  if (!session) {
    redirect({ href: "/login", locale });
  }

  return <AppShell>{children}</AppShell>;
}
