"use client";

import { useRouter, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProjectFilters({
  query,
  includeArchived,
}: {
  query: string;
  includeArchived: boolean;
}) {
  const t = useTranslations("projects");
  const router = useRouter();
  const pathname = usePathname();

  function apply(nextQuery: string, nextArchived: boolean) {
    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextArchived) params.set("archived", "1");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <form
      className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        apply(String(form.get("q") ?? ""), form.get("archived") === "on");
      }}
    >
      <Input
        name="q"
        defaultValue={query}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchPlaceholder")}
        className="sm:max-w-sm"
        onBlur={(event) => apply(event.target.value, includeArchived)}
      />
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name="archived"
          defaultChecked={includeArchived}
          onChange={(event) => apply(query, event.target.checked)}
        />
        <span>{t("includeArchived")}</span>
      </label>
      <button type="submit" className="sr-only">
        {t("searchPlaceholder")}
      </button>
      <Label className="sr-only">{t("searchPlaceholder")}</Label>
    </form>
  );
}
