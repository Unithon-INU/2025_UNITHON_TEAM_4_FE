import { create } from "zustand";

interface LangState {
  lang: "kor" | "eng" | "jpn" | "chn" | "fra" | "spa" | "rus";
  setLang: (lang: "kor" | "eng" | "jpn" | "chn" | "fra" | "spa" | "rus") => void;
}

export const useLangStore = create<LangState>((set) => ({
  lang: "kor", // 기본값: 한국어
  setLang: (lang) => set({ lang }),
}));