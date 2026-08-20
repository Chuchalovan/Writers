"use client";

import { useEffect, useState } from "react";

export type StudioLayout = "desktop" | "compact" | "mobile";

export function useStudioLayout(): StudioLayout {
  const [layout, setLayout] = useState<StudioLayout>("desktop");

  useEffect(() => {
    function sync() {
      const width = window.innerWidth;
      if (width < 900) {
        setLayout("mobile");
      } else if (width < 1280) {
        setLayout("compact");
      } else {
        setLayout("desktop");
      }
    }
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return layout;
}
