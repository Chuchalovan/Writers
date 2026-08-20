"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { signOut, useSession } from "@/lib/auth/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeaderAccount({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("header");
  const tAuth = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "?";

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  function switchLocale(newLocale: "ru" | "en") {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className={cn("flex items-center gap-1", compact && "flex-col")}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(compact && "text-chrome-muted hover:bg-chrome-accent hover:text-chrome-foreground")}
            aria-label={t("language")}
          >
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side={compact ? "right" : "bottom"}>
          <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => switchLocale("ru")}
            className={locale === "ru" ? "bg-accent" : ""}
          >
            Русский
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => switchLocale("en")}
            className={locale === "en" ? "bg-accent" : ""}
          >
            English
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "relative h-9 w-9 rounded-full",
              compact && "text-chrome-foreground hover:bg-chrome-accent"
            )}
            aria-label={tAuth("logout")}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className={cn(compact && "bg-chrome-accent text-chrome-foreground")}>
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side={compact ? "right" : "bottom"} className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            {tAuth("logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function Header() {
  return (
    <header className="flex h-16 items-center justify-end border-b bg-background px-6">
      <HeaderAccount />
    </header>
  );
}
