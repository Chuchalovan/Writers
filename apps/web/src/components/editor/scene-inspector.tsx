"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  linkCharacterToSceneAction,
  saveSceneMetadataAction,
  unlinkCharacterFromSceneAction,
} from "@/actions/manuscript";
import { cn } from "@/lib/utils";

type Tab = "scene" | "characters" | "world";

export type InspectorCharacter = { id: string; name: string };
export type InspectorLocation = { id: string; title: string; type: string };
export type InspectorMetadata = {
  goal: string | null;
  conflict: string | null;
  outcome: string | null;
  povCharacterId: string | null;
  locationId: string | null;
  storyTime: string | null;
};

export function SceneInspector({
  sceneId,
  metadata,
  participants,
  characters,
  locations,
}: {
  sceneId: string;
  metadata: InspectorMetadata | null;
  participants: InspectorCharacter[];
  characters: InspectorCharacter[];
  locations: InspectorLocation[];
}) {
  const t = useTranslations("editor");
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("scene");
  const [pending, startTransition] = useTransition();
  const [goal, setGoal] = useState(metadata?.goal ?? "");
  const [conflict, setConflict] = useState(metadata?.conflict ?? "");
  const [povCharacterId, setPovCharacterId] = useState(metadata?.povCharacterId ?? "");
  const [locationId, setLocationId] = useState(metadata?.locationId ?? "");
  const [linkId, setLinkId] = useState("");

  const participantIds = new Set(participants.map((item) => item.id));
  const available = characters.filter((item) => !participantIds.has(item.id));
  const locationOptions = locations.filter((item) => item.type === "location");

  function persistMetadata(patch: Partial<InspectorMetadata>) {
    startTransition(async () => {
      await saveSceneMetadataAction({
        sceneId,
        goal: patch.goal ?? (goal || null),
        conflict: patch.conflict ?? (conflict || null),
        povCharacterId: patch.povCharacterId,
        locationId: patch.locationId,
        storyTime: patch.storyTime,
      });
      router.refresh();
    });
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "scene", label: t("tabScene") },
    { id: "characters", label: t("tabCharacters") },
    { id: "world", label: t("tabWorld") },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex border-b border-chrome-border" role="tablist" aria-label={t("inspector")}>
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={cn(
              "flex-1 px-2 py-3 text-xs font-medium",
              tab === item.id
                ? "border-b-2 border-teal-600 text-chrome-foreground"
                : "text-chrome-muted hover:text-chrome-foreground"
            )}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 text-sm">
        {tab === "scene" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="scene-goal" className="text-chrome-muted">
                {t("goal")}
              </Label>
              <textarea
                id="scene-goal"
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                onBlur={() => persistMetadata({ goal: goal || null })}
                rows={3}
                className="w-full rounded-md border border-chrome-border bg-chrome-accent px-3 py-2 text-sm text-chrome-foreground outline-none focus-visible:ring-1 focus-visible:ring-teal-700"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="scene-conflict" className="text-chrome-muted">
                {t("conflict")}
              </Label>
              <textarea
                id="scene-conflict"
                value={conflict}
                onChange={(event) => setConflict(event.target.value)}
                onBlur={() => persistMetadata({ conflict: conflict || null })}
                rows={3}
                className="w-full rounded-md border border-chrome-border bg-chrome-accent px-3 py-2 text-sm text-chrome-foreground outline-none focus-visible:ring-1 focus-visible:ring-teal-700"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="scene-pov" className="text-chrome-muted">
                {t("pov")}
              </Label>
              <select
                id="scene-pov"
                disabled={pending}
                value={povCharacterId}
                onChange={(event) => {
                  const value = event.target.value;
                  setPovCharacterId(value);
                  persistMetadata({ povCharacterId: value || null });
                }}
                className="h-9 w-full rounded-md border border-chrome-border bg-chrome-accent px-2 text-sm text-chrome-foreground"
              >
                <option value="">{t("none")}</option>
                {characters.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="scene-location" className="text-chrome-muted">
                {t("location")}
              </Label>
              <select
                id="scene-location"
                disabled={pending}
                value={locationId}
                onChange={(event) => {
                  const value = event.target.value;
                  setLocationId(value);
                  persistMetadata({ locationId: value || null });
                }}
                className="h-9 w-full rounded-md border border-chrome-border bg-chrome-accent px-2 text-sm text-chrome-foreground"
              >
                <option value="">{t("none")}</option>
                {locationOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {tab === "characters" && (
          <div className="space-y-3">
            {participants.length === 0 ? (
              <p className="text-chrome-muted">{t("noParticipants")}</p>
            ) : (
              <ul className="space-y-2">
                {participants.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-2">
                    <span>{item.name}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-chrome-muted hover:text-chrome-foreground"
                      disabled={pending}
                      onClick={() => {
                        startTransition(async () => {
                          await unlinkCharacterFromSceneAction({ sceneId, characterId: item.id });
                          router.refresh();
                        });
                      }}
                    >
                      {t("unlink")}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            {available.length > 0 ? (
              <div className="flex gap-2">
                <select
                  value={linkId}
                  onChange={(event) => setLinkId(event.target.value)}
                  className="h-9 min-w-0 flex-1 rounded-md border border-chrome-border bg-chrome-accent px-2 text-sm"
                  aria-label={t("linkCharacter")}
                >
                  <option value="">{t("linkCharacter")}</option>
                  {available.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  size="sm"
                  disabled={pending || !linkId}
                  onClick={() => {
                    const characterId = linkId;
                    setLinkId("");
                    startTransition(async () => {
                      await linkCharacterToSceneAction({ sceneId, characterId });
                      router.refresh();
                    });
                  }}
                >
                  {t("link")}
                </Button>
              </div>
            ) : (
              <p className="text-xs text-chrome-muted">{t("noCharacters")}</p>
            )}
          </div>
        )}

        {tab === "world" && (
          <p className="text-chrome-muted">
            {locationOptions.length === 0 ? t("noLocations") : t("worldHint")}
          </p>
        )}
      </div>
    </div>
  );
}
