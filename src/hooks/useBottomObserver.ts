// src/hooks/useBottomObserver.ts
import { useRef, useEffect } from "react";

export function useBottomObserver(callback: () => void, enabled = true) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) callback();
      },
      { threshold: 1.0 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [callback, enabled]);

  return ref;
}
