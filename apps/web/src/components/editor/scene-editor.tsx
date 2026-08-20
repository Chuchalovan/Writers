"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { AUTOSAVE_DEBOUNCE_MS, countCharacters, countWords, ERROR_CODES } from "@manuscript/shared";
import { useTranslations } from "next-intl";
import { saveSceneContentAction, getSceneAction } from "@/actions/manuscript";
import { Button } from "@/components/ui/button";
import {
  clearSceneBuffer,
  readSceneBuffer,
  writeSceneBuffer,
} from "@/lib/editor/scene-buffer";

type SaveStatus = "saved" | "saving" | "device" | "conflict" | "error";

const EMPTY_DOC = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export function SceneEditor({
  sceneId,
  initialJson,
  initialPlainText,
  initialVersion,
  embedded = false,
}: {
  sceneId: string;
  initialJson: Record<string, unknown> | null;
  initialPlainText: string | null;
  initialVersion: number;
  embedded?: boolean;
}) {
  const t = useTranslations("editor");
  const versionRef = useRef(initialVersion);
  const [status, setStatus] = useState<SaveStatus>("saved");
  const [narrow, setNarrow] = useState(false);
  const [wordCount, setWordCount] = useState(() => countWords(initialPlainText ?? ""));
  const [charCount, setCharCount] = useState(() => countCharacters(initialPlainText ?? ""));
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRef = useRef({ json: initialJson ?? EMPTY_DOC, text: initialPlainText ?? "" });

  const persist = useCallback(
    async (force = false) => {
      const payload = latestRef.current;
      await writeSceneBuffer({
        sceneId,
        contentJson: payload.json,
        plainText: payload.text,
        updatedAt: Date.now(),
      });
      if (!navigator.onLine && !force) {
        setStatus("device");
        return;
      }
      setStatus("saving");
      try {
        const result = await saveSceneContentAction({
          sceneId,
          contentJson: payload.json,
          plainText: payload.text,
          baseVersion: versionRef.current,
        });
        if (result && typeof result === "object" && "error" in result) {
          const code = (result as { error: { code: string } }).error.code;
          setStatus(code === ERROR_CODES.CONFLICT ? "conflict" : "error");
          return;
        }
        if (result && "version" in result) {
          versionRef.current = result.version;
        }
        await clearSceneBuffer(sceneId);
        setStatus("saved");
      } catch {
        setStatus(navigator.onLine ? "error" : "device");
      }
    },
    [sceneId]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
    ],
    content: (initialJson as object) ?? EMPTY_DOC,
    editorProps: {
      attributes: {
        class: embedded
          ? "min-h-[50vh] max-w-[65ch] font-serif text-lg leading-relaxed outline-none"
          : "min-h-[60vh] max-w-[65ch] font-serif text-lg leading-relaxed outline-none",
      },
    },
    onUpdate: ({ editor: instance }) => {
      const json = instance.getJSON() as Record<string, unknown>;
      const text = instance.getText();
      latestRef.current = { json, text };
      setWordCount(countWords(text));
      setCharCount(countCharacters(text));
      void writeSceneBuffer({ sceneId, contentJson: json, plainText: text, updatedAt: Date.now() });
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        void persist();
      }, AUTOSAVE_DEBOUNCE_MS);
    },
    onBlur: () => {
      void persist();
    },
  });

  useEffect(() => {
    const media = window.matchMedia("(max-width: 899px)");
    const sync = () => setNarrow(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    void (async () => {
      const buffered = await readSceneBuffer(sceneId);
      if (buffered && editor && !editor.isDestroyed) {
        latestRef.current = { json: buffered.contentJson, text: buffered.plainText };
        editor.commands.setContent(buffered.contentJson);
        setWordCount(countWords(buffered.plainText));
        setCharCount(countCharacters(buffered.plainText));
        setStatus("device");
      }
    })();
  }, [editor, sceneId]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void persist(true);
      }
    }
    function onOnline() {
      void persist(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("online", onOnline);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [persist]);

  if (narrow) {
    return (
      <div className="text-sm text-muted-foreground">
        <p className="whitespace-pre-wrap font-serif text-base text-foreground">{initialPlainText}</p>
        <p className="mt-4">{t("mobileReadOnly")}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3 font-label text-xs text-muted-foreground">
        <span>{t("saveStatus", { status })}</span>
        <span>{t("wordCount", { count: wordCount })}</span>
        <span>{t("charCount", { count: charCount })}</span>
        {status === "conflict" && (
          <span className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={async () => {
                const latest = await getSceneAction(sceneId);
                const json = (latest.content?.contentJson as Record<string, unknown>) ?? EMPTY_DOC;
                const text = latest.content?.plainText ?? "";
                versionRef.current = latest.content?.version ?? versionRef.current;
                latestRef.current = { json, text };
                editor?.commands.setContent(json);
                setWordCount(countWords(text));
                setCharCount(countCharacters(text));
                await clearSceneBuffer(sceneId);
                setStatus("saved");
              }}
            >
              {t("loadServer")}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={async () => {
                const latest = await getSceneAction(sceneId);
                versionRef.current = latest.content?.version ?? versionRef.current;
                await persist(true);
              }}
            >
              {t("keepMine")}
            </Button>
          </span>
        )}
        {status === "error" && (
          <Button type="button" size="sm" variant="outline" onClick={() => persist(true)}>
            {t("retry")}
          </Button>
        )}
      </div>
      <div className={embedded ? "bg-transparent py-2" : "rounded-lg border bg-background p-8 shadow-sm"}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
