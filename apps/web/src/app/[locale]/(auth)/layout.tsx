import { redirect } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();

  if (session) {
    redirect({ href: "/projects", locale });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/20 p-6">
      {children}
    </div>
  );
}
